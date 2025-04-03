import { getAllOrders } from '../db/ordersDAO.js';

const orders = await getAllOrders();

for (let i = 0; i < orders.length; i += 1) {
	const order = orders[i];
}

console.log('Done!');
process.exit();