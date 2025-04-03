'use server'

import { cookies } from 'next/headers';

import {
	getOrderById,
	attachNewCard,
	attachNewPayment,
	attachStripeCustomerProfileData 
} from 'lib/http/ordersDAO';

import {
	stripeAddCustomer,
	stripeAddCreditCard,
	stripeChargeCard,
	recordNewCardPayment,
	uploadPaymentImage,
	recordNewImagePayment 
} from 'lib/http/paymentsDAO';

import { 
	finalizeInvoice
} from 'lib/http/invoicesDAO';

import { sendFinalizedOrderEmail, sendInvoicePaidEmail } from 'lib/loopMailer';

export async function addCardAndPayByCard(data) {
	const uploader = cookies().has('user') ? JSON.parse(cookies().get('user').value)?.username : 'CUSTOMER';
	let paymentIntent = false;
	let registeredCard = false;
	let paymentRecord = false;

	try {
		const order = await getOrderById(data.orderId);
		// Define a customer in Stripe if one hasn't been created yet for this order
		// Make sure to link the Stripe customer with the order in our system
		if (!(order.payments.customer?.id)) {
			order.payments.customer = await stripeAddCustomer(order);
			await attachStripeCustomerProfileData(order._id, order.payments.customer);
		}
		// Register the card in stripe
		// Make sure to note the registration details inside our database so that it can be charged again if needed
		registeredCard = await stripeAddCreditCard(data, order);
		if (registeredCard) {
			await attachNewCard(order._id, registeredCard);
			paymentIntent = await stripeChargeCard({
				card: registeredCard.id,
				...data
			}, order);
			if (paymentIntent) {
				// Create a payment record and attach a reference of that payment record directly to the order
				paymentRecord = await recordNewCardPayment(paymentIntent, order._id, registeredCard, uploader, order.customer.state, data.invoiceId);
				await attachNewPayment(order._id, paymentRecord._id, paymentRecord.amount);

				// @TODO - Put logic here that automatically closes out any other open quotes for the order after a payment has been made

				// If this payment follows from an invoice, update the invoice to mark it as paid
				if (data.invoiceId) {
					await finalizeInvoice(data.invoiceId);
					sendInvoicePaidEmail(data.orderId, data.invoiceId);
				}
			}
		}
	} catch (error) {
		console.error(error);
	}

	// @TODO: Add logging here to indicate whether the payment was made, but unsuccessfully recorded in the system
	return { success: paymentIntent ? true : false, card: registeredCard, payment: paymentRecord };
}

export async function payByCard(data) {
	const uploader = cookies().has('user') ? JSON.parse(cookies().get('user').value)?.username : 'CUSTOMER';
	let paymentIntent = false;
	let paymentRecord = false;

	try {
		const order = await getOrderById(data.orderId);
		if (!(order.payments.customer?.id)) {
			order.payments.customer = await stripeAddCustomer(order);
		}
		paymentIntent = await stripeChargeCard(data, order);
		if (paymentIntent) {
			// Isolate the credit card responsible for the charge
			const card = order.payments.cards.find((card) => card.id === paymentIntent.payment_method);

			// Create a payment record and attach a reference of that payment record directly to the order
			paymentRecord = await recordNewCardPayment(paymentIntent, order._id, card, uploader, order.customer.state, data.invoiceId);
			await attachNewPayment(order._id, paymentRecord._id, paymentRecord.amount);

			// If this payment follows from an invoice, update the invoice to mark it as paid
			if (data.invoiceId) {
				await finalizeInvoice(data.invoiceId);
				sendInvoicePaidEmail(data.orderId, data.invoiceId);
			}
		}
	} catch (error) {
		console.error(error);
	}

	// @TODO: Add logging here to indicate whether the payment was made, but unsuccessfully recorded in the system
	return { success: paymentIntent ? true : false, payment: paymentRecord };
}

export async function payByImage(formData) {
	const uploader = cookies().has('user') ? JSON.parse(cookies().get('user').value)?.username : 'CUSTOMER';
	const uploadedFile = formData.get('paymentImage');
	const paymentAmount = formData.get('paymentAmount');
	const orderId = formData.get('orderId');

	try {
		const order = await getOrderById(orderId);

		// Upload the check image to storage first before noting it inside the database
		const uploadedPaymentBlob = await uploadPaymentImage(uploadedFile, orderId);

		const paymentRecord = await recordNewImagePayment(uploadedPaymentBlob, orderId, paymentAmount, order.customer.state, uploader);
		await attachNewPayment(orderId, paymentRecord._id, paymentRecord.amount);

		// @TODO - Put logic here that automatically closes out any other open quotes for the order after a payment has been made

		return { success: true, payment: paymentRecord };
	} catch (error) {
		console.error(error);
		return { success: false, payment: false };
	}
}