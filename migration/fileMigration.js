import { addFile } from './db/filesDAO.js';
import { getAllOrders } from './db/ordersDAO.js';

const orders = await getAllOrders();

let migratedFiles = [];
for (let i = 0; i < orders.length; i += 1) {
	const order = orders[i];

	const pictures = order.pictures || [];
	const files = order.files || [];
	const drawings = order.drawings || [];
	const filesToProcess = [...pictures, ...files, ...drawings];

	console.log('Processing order ' + order._id);
	for (let j = 0; j < filesToProcess.length; j += 1) {
		console.log('Migrating the following file: ' + filesToProcess[j].name);
		const migratedFile = await addFile(filesToProcess[j], order._id);
		migratedFiles.push(migratedFile);
	}
}

console.log('Done!');
process.exit();