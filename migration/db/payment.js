import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	type: {
		type: String,
	},

	orderId: Number,

	amount: Number,
	tax: Number,
	fee: Number,

	admin: String,
	date: Date,
	reason: String,
	state: String,

	details: Object
}, { collection: 'payments' });

export default mongoose.model('Payment', PaymentSchema);