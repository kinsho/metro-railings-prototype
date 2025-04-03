import { getAllOrders, updateOrder } from './db/ordersDAO.js';
import { findNotesByOrder } from './db/notesDAO.js';
import { findFilesByOrder } from './db/filesDAO.js';
import { findInvoicesByOrder } from './db/invoicesDAO.js';
import { getPaymentsByOrder } from './db/paymentsDAO.js';

import { MIGRATION_USER, AGREEMENT } from './env.js';

const orders = await getAllOrders();

let migratedOrders = [];
for (let i = 0; i < orders.length; i += 1) {
	const order = orders[i];
	let migratedOrder = {};

	console.log('Migrating order ' + order._id);

	// ID
	migratedOrder._id = order._id;

	// Sales Meta
	migratedOrder.sales = {
		header: '',
		assignees: []
	};

	// Customer Info
	const migratedEmails = order.customer?.email ? (Array.isArray(order.customer.email) ? order.customer.email : order.customer.email.split(',')) : '';

	migratedOrder.customer = {
		name: order.customer?.name || '',
		company: order.customer?.company || '',
		email: migratedEmails,
		areaCode: order.customer?.areaCode || '',
		phoneOne: order.customer?.phoneOne || '',
		phoneTwo: order.customer?.phoneTwo || '',
		address: order.customer?.address || '',
		city: order.customer?.city || '',
		state: order.customer?.state || '',
		zipCode: order.customer?.zipCode || '',
		nickname: ''
	};

	// Design Info
	migratedOrder.design = {
		type: order.design?.type || null,
		post: order.design?.post || null,
		handrailing: order.design?.handrailing || null,
		postEnd: order.design?.postEnd || null,
		postCap: order.design?.postCap || null,
		ada: order.design?.ada || null,
		color: order.design?.color || null,
		picketSize: order.design?.picketSize || null,
		picketStyle: order.design?.picketStyle || null,
		centerDesign: order.design?.centerDesign || null,
		collars: order.design?.collars || null,
		baskets: order.design?.baskets || null,
		valence: order.design?.valence || null,
		cableSize: order.design?.cableSize || null,
		glassType: order.design?.glassType || null,
		glassBuild: order.design?.glassBuild || null
	};
	migratedOrder.designDescription = {
		type: order.designDescription?.type,
		post: order.designDescription?.post,
		handrailing: order.designDescription?.handrailing,
		postEnd: order.designDescription?.postEnd,
		postCap: order.designDescription?.postCap,
		ada: order.designDescription?.ada,
		color: order.designDescription?.color,
		picketSize: order.designDescription?.picketSize,
		picketStyle: order.designDescription?.picketStyle,
		centerDesign: order.designDescription?.centerDesign,
		collars: order.designDescription?.collars,
		baskets: order.designDescription?.baskets,
		valence: order.designDescription?.valence,
		cableSize: order.designDescription?.cableSize,
		glassType: order.designDescription?.glassType,
		glassBuild: order.designDescription?.glassBuild
	};

	// Dimensions
	migratedOrder.dimensions = {
		length: order.dimensions?.length || 0,
		finishedHeight: order.dimensions?.finishedHeight || 0
	};

	// Pricing
	migratedOrder.pricing = {
		pricePerFoot: order.pricing?.pricePerFoot || 0,
		additionalPrice: order.pricing?.additionalPrice || 0,
		tax: order.pricing?.tax || 0,
		fee: order.pricing?.ccFee || 0,
		isTaxApplied: order.pricing?.isTaxApplied || false,
		isFeeApplied: order.pricing?.applyCCSurcharge || false,
		subtotal: order.pricing?.subtotal || 0,
		orderTotal: order.pricing?.orderTotal || 0,
		shopBonus: 0
	};

	// Payments
	const legacyCards = order.payments?.cards || [];
	const payments = await getPaymentsByOrder(order._id);
	const migratedCards = legacyCards.map((card) => {
		return {
			id: card.id,
			brand: card.brand,
			exp_month: card.exp_month,
			exp_year: card.exp_year,
			last4: card.last4
		};
	});

	migratedOrder.payments = {
		balanceRemaining: order.payments?.balanceRemaining || 0,
		customer: {
			id: order.payments?.customer?.id || '',
			createdOn: (order.payments?.customer?.created ? order.payments.customer.created * 1000 : null)
		},
		cards: migratedCards,
		charges: payments.map(payment => payment._id) || []
	}

	// Status and Text
	migratedOrder.status = (order.status === 'prospect' ? 'lead' : order.status);
	migratedOrder.text = {
		additionalDescription: order.text?.additionalDescription || '',
		agreement: AGREEMENT.PATH
	};

	// Dates
	migratedOrder.dates = {
		created: order.dates?.created || new Date(),
		lastModified: order.dates?.lastModified || new Date()
	};
	if (order.dates?.finalized) {
		migratedOrder.dates.finalized = order.dates.finalized;
	}
	if (order.dates?.due) {
		migratedOrder.dates.due = order.dates.due;
	}

	// Mod History
	migratedOrder.modHistory = order.modHistory || [];
	migratedOrder.modHistory.push({
		user: MIGRATION_USER.USERNAME,
		date: new Date(),
		reason: '2024 Migration'
	});

	// Notes, Files, and Invoices
	const orderNotes = await findNotesByOrder(order._id);
	const orderFiles = await findFilesByOrder(order._id);
	const orderInvoices = await findInvoicesByOrder(order._id);

	migratedOrder.notes = orderNotes.map(note => note._id) || [];
	migratedOrder.tasks = [];
	migratedOrder.shopNotes = [];
	migratedOrder.files = orderFiles.map(file => file._id);
	migratedOrder.invoices = orderInvoices.map(invoice => invoice._id);

	// Migration Meta
	migratedOrder.users = {
		creator: MIGRATION_USER.USERNAME,
		lastModifier: MIGRATION_USER.USERNAME
	};
	migratedOrder.migrated = true;

	// END
	console.log('Ready to port over order ' + migratedOrder._id);
	migratedOrders.push(migratedOrder);
}

for (let j = 0; j < migratedOrders.length; j += 1) {
	await updateOrder(migratedOrders[j]);
	console.log('Order ' + migratedOrders[j]._id + ' migrated!');
}

console.log('Done!');
process.exit();