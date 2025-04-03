import mongoose, { } from 'mongoose';

import { getAllStatusKeys } from '../lib/dictionary.js';

const OrderSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	sales: {
		header: String,
		assignees: [{
			username: String,
			commission: Number
		}]
	},

	customer: {
		name: {
			type: String,
			required: true
		},
		company: String,
		email: {
			type: [String],
			default: []
		},
		areaCode: String,
		phoneOne: String,
		phoneTwo: String,
		address: String,
		aptSuiteNo: String,
		city: String,
		state: String,
		zipCode: String,
		nickname: String
	},

	design: {
		type: {
			type: String
		},
		post: String,
		handrailing: String,
		postEnd: String,
		postCap: String,
		ada: String,
		color: String,

		picketSize: String,
		picketStyle: String,
		centerDesign: String,
		collars: String,
		baskets: String,
		valence: String,

		cableSize: String,
		glassType: String,
		glassBuild: String
	},

	designDescription: {
		type: {
			type: String
		},
		post: String,
		handrailing: String,
		postEnd: String,
		postCap: String,
		ada: String,
		color: String,

		picketSize: String,
		picketStyle: String,
		centerDesign: String,
		collars: String,
		baskets: String,
		valence: String,

		cableSize: String,
		glassType: String,
		glassBuild: String
	},

	dimensions: {
		length: Number,
		finishedHeight: Number
	},

	pricing: {
		pricePerFoot: {
			type: Number,
			default: 0
		},
		additionalPrice: {
			type: Number,
			default: 0
		},
		isTaxApplied: {
			type: Boolean,
			default: false
		},
		isFeeApplied: {
			type: Boolean,
			default: false
		},
		subtotal: {
			type: Number,
			default: 0
		},
		tax: {
			type: Number,
			default: 0
		},
		fee: {
			type: Number,
			default: 0
		},
		orderTotal: {
			type: Number,
			default: 0
		},
		shopBonus: {
			type: Number,
			default: 0
		},
	},

	status: {
		type: String,
		enum: getAllStatusKeys()
	},

	text: {
		agreement: {
			type: String,
			default: 'assets/text/terms/2020.contract.txt'
		},
		additionalDescription: String
	},

	payments: {
		balanceRemaining: Number,
		customer: Object,
		cards: [{
			id: String,
			brand: String,
			exp_month: Number,
			exp_year: Number,
			last4: String
		}],
		charges: [Number],
	},

	modHistory: [{
		user: String,
		date: Date,
		reason: String
	}],

	dates: {
		created: Date,
		lastModified: Date,
		finalized: Date,
		due: Date
	},

	users: {
		creator: String,
		lastModifier: String
	},

	notes: [Number],
	tasks: [Number],
	shopNotes: [Number],
	files: [Number],
	invoices: [Number],

	migrated: {
		type: Boolean,
		default: false
	},

}, { collection: 'orders' });

export default mongoose.model('prodOrder', OrderSchema);