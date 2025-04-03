import dbConnect from './driver.js';
import Invoices from './invoice.js';
import Counters from './counter.js';

import { MIGRATION_USER, AGREEMENT } from '../env.js';

export async function createNewQuoteInvoice(order, amountToPay, paymentDate) {
	await dbConnect();

	const username = MIGRATION_USER.USERNAME;

	// Pull the ID number from our counters collection and increment the ID sequencer accordingly
	const countersResult = await Counters.findByIdAndUpdate('invoices', { $inc: { seq: 1 } }).exec();
	
	const newQuote = {
		_id: countersResult.seq,
		orderId: order._id,
		status: 'finalized',
		category: 'quote',
		amount: amountToPay,
		termsFileHandle: AGREEMENT.PATH,
		dates: {
			created: paymentDate,
			finalized: paymentDate
		},
		users: {
			creator: username
		},
		customer: order.customer,
		design: order.design || {},
		designDescription: order.designDescription || {},
		dimensions: order.dimensions || {},
		text: order.text || '',
		payments: {
			balanceRemaining: order.pricing.orderTotal
		},
		pricing: order.pricing
	};

	try {
		return await Invoices.create(newQuote);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function updateOrderMetadata(order, invoiceId) {
	await dbConnect();

	try {
		await Invoices.findOneAndUpdate({ _id: invoiceId }, { ...order }, { upsert: false });
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function findInvoicesByOrder(orderId) {
	await dbConnect();

	try {
		return await Invoices.find({ orderId: orderId }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}