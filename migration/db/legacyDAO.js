import legacyConnect from './legacyDriver.js';
import dbConnect from './driver.js';
import Payments from './payment.js';
import Orders from './order.js';
import Notes from './note.js';
import Counters from './counter.js';
import Admins from './admin.js';
import Files from './file.js';
import Invoices from './invoice.js';
import Users from './user.js';

export async function pullLegacyData() {
	await legacyConnect();

	try {
		console.log('Pulling all legacy data...');
		const legacyOrders = await Orders.find().exec();
		const legacyPayments = await Payments.find().exec();
		const legacyNotes = await Notes.find().exec();
		const legacyAdmins = await Admins.find({ password: { $exists: true } }).exec();
		const legacyCounters = await Counters.find().exec();

		return {
			orders: legacyOrders,
			payments: legacyPayments,
			notes: legacyNotes,
			counters: legacyCounters,
			users: legacyAdmins
		};
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function clearCollectionData() {
	await dbConnect();

	try {
		await Orders.deleteMany({ _id: { $gte: 1 } });
		await Notes.deleteMany({ _id: { $gte: 1 } });
		await Payments.deleteMany({ _id: { $gte: 1 } });
		await Files.deleteMany({ _id: { $gte: 1 } });
		await Invoices.deleteMany({ id: { $gte: 1 } });
		await Counters.deleteMany({ seq: { $gte: 1 } });
		await Users.deleteMany({ username: { $ne: '' } });
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function insertLegacyOrders(orders) {
	await dbConnect();

	try {
		await Orders.insertMany(orders);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function insertLegacyPayments(payments) {
	await dbConnect();

	try {
		await Payments.insertMany(payments);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function insertLegacyNotes(notes) {
	await dbConnect();

	try {
		await Notes.insertMany(notes);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function insertLegacyUsers(users) {
	await dbConnect();

	try {
		await Users.insertMany(users);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function insertLegacyCounters(counters) {
	await dbConnect();
	
	try {
		await Counters.insertMany([
			...counters,
			{
				_id: 'gallery',
				seq: 1000
			},
			{
				_id: 'invoices',
				seq: 2001
			}
		]);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}