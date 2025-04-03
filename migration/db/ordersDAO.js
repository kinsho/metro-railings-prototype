import dbConnect from './driver.js';
import Orders from './order.js';
import newOrders from './newOrder.js';
import prodOrders from './prodOrder.js';

export async function getAllOrders() {
	await dbConnect();

	try {
		return await Orders.find().sort({ _id: 1 }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function updateOrder(order) {
	await dbConnect();

	try {
		await newOrders.updateOne({
			_id: order._id,
		}, order, {
			upsert: true
		}).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function getOrdersByDateRange(beginDate, endDate) {
	await dbConnect();

	try {
		return await prodOrders.find({
			'dates.created': { $gte: beginDate, $lte: endDate },
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}