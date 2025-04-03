import { NextResponse } from 'next/server';

import dbConnect from "lib/database";
import { logRequest } from "lib/logger";

import Orders from "lib/models/order";

/**
 * Function to retrieve all open orders
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
	await dbConnect();
	logRequest('api/admin/orders', 'GET');

	try {
		const allOrders = await Orders.find().exec();
		return NextResponse.json(allOrders, { status : 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: "Server issue" }, { status: 500 });
	}
}