import { cookies } from 'next/headers';

import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Invoices from 'lib/models/invoice';
import Counters from 'lib/models/counters';

/**
 * Function responsible for getting an invoice. The order ID associated with the invoice has to be provided along with the invoice ID
 *
 * @param {Number} orderId
 * @param {Number} invoiceId
 */
export async function getInvoice(orderId, invoiceId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/getInvoice', ...arguments);

	try {
		return await Invoices.findOne({ _id: invoiceId, orderId: orderId }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for creating a new quote based off whatever details are present within an order
 *
 * @param {Order} order
 * @param {Number} amountToPay
 */
export async function createNewQuoteInvoice(order, amountToPay, paymentDate) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/createNewQuoteInvoice', ...arguments);

	const username = JSON.parse(cookies().get('user').value).username;

	// Pull the ID number from our counters collection and increment the ID sequencer accordingly
	const countersResult = await Counters.findByIdAndUpdate('invoices', { $inc: { seq: 1 } }).exec();

	const newQuote = {
		...order, // Keep in mind that the only properties from the order that will actually be saved into this invoice are the ones explicitly defined in the Mongoose schema
		_id: countersResult.seq,
		orderId: order._id,
		status: 'open',
		category: 'quote',
		amount: amountToPay,
		termsFileHandle: process.env.CURRENT_TERMS_AND_CONDITIONS_CONTRACT,
		dates: {
			created: paymentDate || new Date()
		},
		users: {
			creator: username
		}
	};

	try {
		return await Invoices.create(newQuote);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for creating a progress invoice based off whatever details are present within an order
 *
 * @param {Order} order
 * @param {Number} amountToPay
 */
export async function createNewProgressInvoice(order, amountToPay) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/createNewProgressInvoice', ...arguments);

	const username = JSON.parse(cookies().get('user').value).username;

	// Pull the ID number from our counters collection and increment the ID sequencer accordingly
	const countersResult = await Counters.findByIdAndUpdate('invoices', { $inc: { seq: 1 } }).exec();

	const newInvoice = {
		...order, // Keep in mind that the only properties from the order that will actually be saved into this invoice are the ones explicitly defined in the Mongoose schema
		_id: countersResult.seq,
		orderId: order._id,
		status: 'open',
		category: 'progress',
		amount: amountToPay,
		termsFileHandle: process.env.CURRENT_TERMS_AND_CONDITIONS_INVOICE,
		dates: {
			created: new Date()
		},
		users: {
			creator: username
		}
	};

	try {
		return await Invoices.create(newInvoice);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for updating any information within a particular invoice
 *
 * @param {Number} invoiceId
 * @param {Object} invoiceData
 */
export async function updateInvoice(invoiceId, invoiceData) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/updateInvoice', ...arguments);

	try {
		const updatedInvoice = await Invoices.findOneAndUpdate({
			_id: invoiceId
		}, {
			...invoiceData
		}, {
			upsert: false,
			new: true
		}).exec();

		return updatedInvoice;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for finalizing an invoice and including all the other required metadata to properly close out the invoice
 *
 * @param {Number} invoiceId
 */
export async function finalizeInvoice(invoiceId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/invoicesDAO/updateInvoice', ...arguments);

	try {
		const updatedInvoice = await Invoices.findOneAndUpdate({
			_id: invoiceId
		}, {
			status: 'finalized',
			'dates.finalized': new Date()
		}, {
			upsert: false,
			new: true
		}).exec();

		return updatedInvoice;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}	
}