/* eslint-disable no-unused-vars */

import mongoose, { Schema } from 'mongoose';

import { getAllStatusKeys } from 'lib/dictionary';

import Note from 'lib/models/note';
import File from 'lib/models/file';
import Invoice from 'lib/models/invoice';
import Payment from 'lib/models/payment';

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
			type: Schema.Types.Mixed,
			default: '',
		},
		additionalDescription: String
	},

	payments: {
		balanceRemaining: Number,
		customer: {
			id: String,
			createdOn: Date
		},
		cards: [{
			id: String,
			brand: String,
			exp_month: Number,
			exp_year: Number,
			last4: String
		}],
		charges: {
			type: [{
				type: Schema.Types.Number,
				ref: 'Payment'
			}],
			default: []
		},
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

	notes: {
		type: [{
			type: Schema.Types.Number,
			ref: 'Notes'
		}],
		default: []
	},
	tasks: {
		type: [{
			type: Schema.Types.Number,
			ref: 'Notes'
		}],
		default: []
	},
	shopNotes: {
		type: [{
			type: Schema.Types.Number,
			ref: 'Notes'
		}],
		default: []
	},
	files: {
		type: [{
			type: Schema.Types.Number,
			ref: 'File'
		}],
		default: []
	},
	invoices: {
		type: [{
			type: Schema.Types.Number,
			ref: 'Invoice'
		}],
		default: []
	},

	migrated: {
		type: Boolean,
		default: false
	},

}, { collection: 'orders' })

OrderSchema.set('timestamps', true)
OrderSchema.set('toJSON', { virtuals: true })
OrderSchema.set('toObject', { virtuals: true })

OrderSchema.post('findOne', (doc) => {
	const designKeys = Object.keys(doc.design);

	for (let i = 0; i < designKeys.length; i += 1) {
		if ( !(doc.design[designKeys[i]]) ) {
			delete doc.design[designKeys[i]];
			delete doc.designDescription[designKeys[i]];
		}
	}
});

module.exports = (mongoose.models?.Order || mongoose.model('Order', OrderSchema));