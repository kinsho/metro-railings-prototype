import dbConnect from './driver.js';
import NewPayment from './newPayment.js';
import ProdPayment from './prodPayment.js';

export async function updatePayment(payment) {
	await dbConnect();

	try {
		return await NewPayment.updateOne({ 
				_id: payment._id
			}, payment, {
			upsert: true
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function getPaymentsByOrder(orderId) {
	await dbConnect();

	try {
		return await NewPayment.find({ orderId: orderId }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function getPaymentsByDateRange(beginDate, endDate) {
	await dbConnect();

	try {
		return await ProdPayment.find({
			date: { $gte: beginDate, $lte: endDate }
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}