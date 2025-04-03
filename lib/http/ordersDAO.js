import { cookies } from 'next/headers';

import { initStatus, quoteStatus, shopStatuses, openStatuses, getStatusMetadata } from 'lib/dictionary';
import { calculateOrderTotal } from 'lib/utils';
import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Orders from 'lib/models/order';
import Counters from 'lib/models/counters';

/**
 * Helper function designed to centralize all logic dedicated to keep pricing data consistent
 *
 * @param {Object} - the order
 */
function updatePricingData(order){
	// Keep all pricing data consistent
	if (order?.pricing) {
		const { tax, fee, totalPrice } = calculateOrderTotal(order.pricing.subtotal, order.pricing.isTaxApplied, order.pricing.isFeeApplied, order.customer.state);

		order.pricing.tax = tax;
		order.pricing.fee = fee;
		order.pricing.orderTotal = totalPrice;
		order.payments.balanceRemaining = order.pricing.orderTotal - order.payments.charges.reduce((accumulator, payment) => accumulator + payment.amount, 0);
	}
}

/**
 * Function designed to notate who is modifying the order, when the order is being modified, and why the order is being modified
 *
 * @param {String} - the reason why this order is being modified
 */
export function updateModHistory(reason = 'Update') {
	const username = JSON.parse(cookies().get('user').value).username;

	return {
		user: username,
		date: new Date(),
		reason: reason
	};
}

/**
 * Function to retrieve all orders, period
 *
 * @returns {Promise<[Order]>}
 */
export async function getAllOrders() {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/getAllOrders');

	try {
		return await Orders.find().populate(['tasks', 'shopNotes']).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to retrieve all open orders
 *
 * @returns {Promise<[Order]>}
 */
export async function getAllOpenOrders() {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/getAllOpenOrders');

	const openStatusList = openStatuses();
	let openStatusKeys = [];
	for (let i = 0; i < openStatusList.length; i += 1) {
		openStatusKeys.push(openStatusList[i].key);
	}

	try {
		return await Orders.find().where('status').in(openStatusKeys).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to retrieve an order by ID
 *
 * @param {String}
 * @returns {Promise<Order>}
 */
export async function getOrderById(id = '') {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/getOrderById');

	try {
		return await Orders.findOne({ _id: parseInt(id, 10) }).populate(['notes', 'tasks', 'shopNotes', 'files', 'invoices', 'payments.charges']).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to save a brand new order (versus an existing one)
 *
 * @param {Order} the new order to save
 */
export async function saveNewOrder(order) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/saveNewOrder');

	const username = JSON.parse(cookies().get('user').value).username;

	// Initialize some of the metadata that will be important to track the life cycle of this order 
	order.dates = {
		created: new Date(),
		lastModified: new Date()
	};
	order.users = {
		creator: username,
		lastModified: username
	};
	order.modHistory = [];
	order.status = initStatus.key;

	// Keep pricing data consistent
	updatePricingData(order);

	try {
		// Pull the ID number from our counters collection and increment the ID sequencer accordingly
		const countersResult = await Counters.findByIdAndUpdate('orders', { $inc: { seq: 1 } }).exec();
		order._id = countersResult.seq;

		await Orders.create(order);
		return order;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to generically save changes to an existing order
 *
 * @param {Number} the ID of the order to update
 * @param {Order} the order to save
 * @param {Object} [modHistoryRecord] - the history to record
 */
export async function saveChangesToOrder(orderId, order, modHistoryRecord = updateModHistory()) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/saveChangesToOrder');

	// Create a paper trail noting who, when, and why this order was updated
	order.dates.lastModified = new Date();
	order.modHistory.push(modHistoryRecord);

	// Keep pricing data consistent
	updatePricingData(order);

	try {
		const savedOrder = await Orders.findOneAndUpdate({
			_id: order._id
		}, order,{
			upsert: false,
			new: true
		}).populate('payments.charges').exec();
		return savedOrder;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function attaching a new note to a particular order
 *
 * @param {Object} note
 */
export async function addNewNoteTaskToOrder(note) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/addNewNoteTaskToOrder');

	let notePushingCommand = {};
	if (note.type === 'note') {
		notePushingCommand = { notes: note._id };
	} else if (note.type === 'task') {
		notePushingCommand = { tasks: note._id };
	} else if (note.type === 'shop') {
		notePushingCommand = { shopNotes: note._id };
	}

	try {
		await Orders.findOneAndUpdate({
			_id: note.orderId
		}, {
			$push: notePushingCommand
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function reclassifying a task or shop note once resolved
 *
 * @param {Object} note
 */
export async function reclassifyNote(noteId, orderId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/reclassifyNote');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { notes: noteId },
			$pull: { tasks: noteId, shopNotes: noteId }
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to link this order to a Stripe customer object
 */
export async function attachStripeCustomerProfileData(orderId, customer) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachStripeCustomerProfileData');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			'payments.customer' : customer,
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to record a credit card as a registerd form of payment on a given order
 */
export async function attachNewCard(orderId, card) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachNewCard');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { 'payments.cards' : card },
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to record a new payment made on against a given order
 */
export async function attachNewPayment(orderId, paymentId, charge) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachNewPayment', arguments);

	try {
		const order = await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { 'payments.charges' : paymentId },
			$inc: { 'payments.balanceRemaining': (-1 * charge) } 
		}, {
			upsert: false,
			new: true
		}).exec();
		
		// Check the order to see if the status and any other metadata needs to be updated now that a new payment has been registered
		let additionalUpdates = {};
		if (getStatusMetadata(order.status).state === 'prospect') {
			additionalUpdates.status = shopStatuses[0].key;
		}
		if (!(order.text.agreement)) {
			additionalUpdates['text.agreement'] = process.env.CURRENT_TERMS_AND_CONDITIONS_CONTRACT;
		}

		// @TODO: Include logic here to reevaluate all quotes associated with this order that are valued at more than whatever the balance remaining is
		// @TODO: Include logic here to cancell all other quotes for the order now that a payment has been made

		if (Object.keys(additionalUpdates).length) {
			await Orders.findOneAndUpdate({
				_id: orderId
			}, additionalUpdates, {
				upsert: false
			});
		}

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function attaching an ID reference for a particular file against a particular order
 *
 * @param {Number} orderId
 * @param {Number} fileId
 */
export async function attachFileToOrder(orderId, fileId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/attachFileToOrder');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		}, {
			$push: { files: fileId }
		}, {
			upsert: false
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function removing an ID reference for a particular file from a particular order
 *
 * @param {Number} orderId
 * @param {Number} fileId
 */
export async function deleteFileFromOrder(orderId, fileId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/deleteFileFromOrder');

	try {
		await Orders.findOneAndUpdate({
			_id: orderId
		},{
			$pull: { files: fileId }
		},{
			upsert: false
		}).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for denoting within an order that a invoice has been issued and udpating the status accordingly should the order still be an early-phase prospect
 *
 * @param {Object} order
 * @param {Number} invoiceId
 */
export async function recordNewInvoice(order, invoiceId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/recordNewInvoice', ...arguments);

	let updateData = {
		status: (getStatusMetadata(order.status).state === 'prospect') ? quoteStatus.key : order.status
	};

	try {
		await Orders.findOneAndUpdate({
			_id: order._id
		}, {
			...updateData,
			$push: { 'invoices' : invoiceId }
		}, {
			upsert: false,
			new: true
		}).exec();

		return true;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function responsible for returning all the credit cards that were used to process payments on a given order
 *
 * @param {Number} orderId
 */
export async function retrieveCards(orderId){
	await dbConnect();
	logServerDatabaseCall('lib/http/ordersDAO/retrieveCards', ...arguments);

	try {
		const order = await Orders.findOne({ _id: orderId }).select('payments.cards').exec();

		return order.payments.cards;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}