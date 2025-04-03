import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	type: {
		type: String,
		enum: ['card', 'other'],
	},

	orderId: {
		type: Number,
		required: true
	},
	invoiceId: {
		type: Number
	},
	amount: {
		type: Number,
		required: true
	},
	tax: {
		type: Number,
		defaultValue: 0
	},
	fee: {
		type: Number,
		defaultValue: 0
	},

	initiatedBy: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},

	stripeMetadata: {
		id: String,
		amount: Number,
		receipt_email: String,
		payment_method: String,
		currency: String,
		card: {
			id: String,
			brand: {
				type: String,
				enum: ['visa', 'mastercard', 'discover', 'amex', '']
			},
			exp_month: Number,
			exp_year: Number,
			last4: String
		}
	},
	imageMetadata: {
		url: String,
		name: String,
		alt: String,
		uploader: String,
		uploadDate: Date
	},
	state: String,

}, { collection: 'payments' });

PaymentSchema.set('timestamps', true)
PaymentSchema.set('toJSON', { virtuals: true })
PaymentSchema.set('toObject', { virtuals: true })

export default mongoose.model('ProdPayment', PaymentSchema);