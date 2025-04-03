import dbConnect from "lib/database";
import { logServerDatabaseCall } from "lib/logger";

import Orders from "lib/models/order";

/**
 * Function to retrieve all orders, period
 *
 * @returns {Promise<[Order]>}
 */
export async function getAllOrders() {
	await dbConnect();
	logServerDatabaseCall('api/admin/orders/getAllOrders');

	try {
		return await Orders.find().exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}
