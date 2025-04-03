import { getAllOrders } from './db/ordersDAO.js';
import { updatePayment } from './db/paymentsDAO.js';

const orders = await getAllOrders();

for (let i = 0; i < orders.length; i += 1) {
	const order = orders[i];
	const payments = order.payments.charges || [];

	console.log('Processing order ' + order._id);
	for (let x = 0; x < payments.length; x += 1) {
		const payment = payments[x];
		console.log('Migrating payment ID: ' + payment._id);

		// Payment Body
		let migratedPayment = {
			_id: payment._id,
			type: payment.type || 'other',
			orderId: payment.orderId,
			amount: payment.amount || 0,
			tax: payment.tax || 0,
			fee: payment.fee || 0,
			initiatedBy: payment.admin || 'CUSTOMER',
			date: payment.date,
			state: payment.state,
		};

		// Stripe Metadata
		if (migratedPayment.type === 'card') {
			migratedPayment.stripeMetadata = {
				id: payment.details?.chargeId || '',
				amount: payment.amount || 0,
				receipt_email: '',
				payment_method: '',
				currency: 'usd',
				card: {
					id: '',
					brand: payment.details?.brand || '',
					exp_month: 0,
					exp_year: 0,
					last4: payment.details?.last4 || '',
				}
			};

		// Image Metadata
		} else {
			migratedPayment.imageMetadata = {
				url: payment.details?.imgLink || '',
				name: 'migratedPaymentImage',
				alt: 'Migrated Payment Image',
				uploader: payment.admin,
				uploadDate: payment.date
			};
		}

		// END
		await updatePayment(migratedPayment);
	}
}

console.log('Done!');
process.exit();