import { createNewQuoteInvoice } from './db/invoicesDAO.js';
import { getAllOrders } from './db/ordersDAO.js';

const orders = await getAllOrders();

for (let i = 0; i < orders.length; i += 1) {
	const order = orders[i];
	const payments = order.payments?.charges || [];

	console.log('Processing order ' + order._id);
	if (payments.length) {
		console.log('Adding a new invoice for this order');
		await createNewQuoteInvoice(order, payments[0].amount, payments[0].date);
	}
}

console.log('Done!');
process.exit();