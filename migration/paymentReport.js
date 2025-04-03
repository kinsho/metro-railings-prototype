import { getPaymentsByDateRange } from './db/paymentsDAO.js';
import { getOrdersByDateRange } from './db/ordersDAO.js';

const beginDate = new Date('01/01/2024');
const endDate = new Date();
const orders = await getOrdersByDateRange(beginDate, endDate);
const payments = await getPaymentsByDateRange(beginDate, endDate);

const drOrders = orders.filter((order) => {
	const emails = order.customer.email;
	return emails.some((email) => email.endsWith('deckremodelers.com'));
});
const drOrderIds = drOrders.map((order) => order._id)

const drPayments = payments.filter((payment) => {
	for (let x = 0; x < drOrderIds.length; x += 1) {
		if (payment.orderId === drOrderIds[x]) {
			return true;
		}
	}

	return false;
});

const drAmountCollected = drPayments.reduce((accumulator, payment) => {
	console.log(payment.amount);
	return accumulator + payment.amount
}, 0);

console.log('Final total comes to ' + Math.round(drAmountCollected * 100) / 100);
console.log('Done!');
process.exit();