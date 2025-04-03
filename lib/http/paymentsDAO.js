import { put } from '@vercel/blob';
import randomStr from 'randomstring';
import stripe from 'stripe';

import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Payments from 'lib/models/payment';
import Counters from 'lib/models/counters';

const striper = stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe function to create a new customer inside Stripe
 */
export async function stripeAddCustomer(order) {
	try {
		// Create a new Customer in Stripe so that we can store and reuse credit cards for a given order
		const stripeCustomer = await striper.customers.create({
			description: order._id,
			email: order.customer.email[0] || '',
			name: order.customer.company || order.customer.name
		});

		const processedCustomer = {
			id: stripeCustomer.id,
			createdOn: new Date(stripeCustomer.created * 1000)
		};

		return processedCustomer;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Stripe function to register a new credit card inside Stripe
 */
export async function stripeAddCreditCard(data){
	try {
		// Use Stripe to register the credit card
		const paymentCharge = await striper.paymentMethods.create({
			type: 'card',
			card: {
				number: data.cardNumber.split(' ').join(''),
				exp_month: data.expiration.split('/')[0],
				exp_year: data.expiration.split('/')[1],
				cvc: data.cardCode
			}
		});

		const processedCard = {
			id: paymentCharge.id,
			brand: paymentCharge.card.brand,
			exp_month: paymentCharge.card.exp_month,
			exp_year: paymentCharge.card.exp_year,
			last4: paymentCharge.card.last4
		};

		return processedCard;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Stripe function to charge a card
 */
export async function stripeChargeCard(data, order){
	try {
		if (order?._id) {
			// Use Stripe to process the payment using the credit card specified in the parameters
			const paymentIntent = await striper.paymentIntents.create({
				amount: parseInt(data.paymentAmount * 100),
				currency: 'usd',
				confirm: true,
				customer: order.payments.customer.id,
				payment_method: data.card,
				metadata: { orderId: order._id, customer: order.customer?.name, company: order.customer?.company || 'N/A' },
				receipt_email: order.customer?.email[0] || process.env.NEXT_PUBLIC_SUPPORT_MAILBOX,
				statement_descriptor: ('Metro Railings ' + order._id),
				setup_future_usage: 'off_session',
				automatic_payment_methods: {
					allow_redirects: 'never',
					enabled: true
				}
			});
			if (paymentIntent.status === 'succeeded') {
				return paymentIntent;
			} else {
				console.error(paymentIntent.status);
				console.error(paymentIntent.last_payment_error);
				return false;
			}
		}

		return false;
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Function to retrieve all payments associated with a particular order
 *
 * @param orderId - the ID of the order being targeted here
 */
export async function getPaymentsByOrderId(orderId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/paymentsDAO/getPaymentsByOrderId', ...arguments);

	try {
		return await Payments.find({ orderId: orderId }).sort({ date: -1 }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to record a new payment into our database
 *
 * @param paymentIntent - the new payment to process and insert into the database
 * @param orderId - the ID of the order associated with this payment
 * @param card - the credit card behind the payment
 * @param [initiator] - the admin responsible for initiating this payment authorization, if an admin was conducting the transaction in the first place
 * @param [orderState] - the state from which the order originates
 * @param [invoiceId] - the invoice associated with this payment, if this payment was made directly through an invoice
 *
 * @returns {Object} - the newly processed payment
 */
export async function recordNewCardPayment(paymentIntent, orderId, card, initiator = 'CUSTOMER', orderState = '', invoiceId = null) {
	await dbConnect();
	logServerDatabaseCall('lib/http/paymentsDAO/recordNewCardPayment', ...arguments);

	const newPayment = {
		type: 'card',
		date: new Date(paymentIntent.created * 1000),
		initiatedBy: initiator,
		orderId: orderId,
		invoiceId: invoiceId,
		amount: paymentIntent.amount / 100,
		tax: Math.round(paymentIntent.amount * 6.625 / 100) / 100,
		fee: 0,
		stripeMetadata: {
			...paymentIntent,
			amount: paymentIntent.amount / 100,
			card: card
		},
		state: orderState || ''
	};

	try {
		// Pull the ID number from our counters collection and increment the ID sequencer accordingly
		const countersResult = await Counters.findByIdAndUpdate('payments', { $inc: { seq: 1 } }).exec();

		// Add the new payment inside the payment collection
		const recordedPayment = await Payments.create({
			_id: countersResult.seq,
			...newPayment
		});

		return recordedPayment;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function recordNewImagePayment(imageBlob, orderId, amount, orderState, uploader = '') {
	await dbConnect();
	logServerDatabaseCall('lib/http/paymentsDAO/recordNewImagePayment', ...arguments);

	const newPaymentMetadata = {
		type: 'other',
		date: new Date(),
		initiatedBy: uploader,
		orderId: orderId,
		amount: amount,
		tax: Math.round(amount * 6.625 ) / 100,
		fee: 0,
		imageMetadata: imageBlob,
		state: orderState || ''
	};

	try {
		// Pull the ID number from our counters collection and increment the ID sequencer accordingly
		const countersResult = await Counters.findByIdAndUpdate('payments', { $inc: { seq: 1 } }).exec();

		const recordedPayment = await Payments.create({
			_id: countersResult.seq,
			...newPaymentMetadata
		});

		return recordedPayment;
	}	catch(error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function uploadPaymentImage(paymentImage, orderId) {
	logServerDatabaseCall('lib/http/paymentsDAO/uploadPaymentImage', ...arguments);

	// Generate a random name for the new check image prior to upload
	const generatedName = randomStr.generate({ length : 9 }) + '.' + paymentImage.name.split('.').pop();

	try {
		// Upload to Vercel using the blob API
		const paymentBlob = await put(process.env.BLOB_DIR + 'payments/' + orderId + '/' + generatedName, paymentImage, { access: 'public' });

		return {
			...paymentBlob,
			name: paymentImage.name
		};
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}