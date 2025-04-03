import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({

	_id: Number,
	orderId: Number,

	text: String,
	author: String,
	closer: String,

	type: {
		type: String,
		enum: ['note', 'task', 'shop', 'event'],
		default: "note"
	},

	assignTo: {
		type: String
	},

	assignFrom: {
		type: String
	},

	status: {
		type: String,
		enum: ['', 'open', 'resolved', 'cancelled'],
		default: ''
	},

	dates: {
		created: Date,
		lastModified: Date
	},

	updateLog: [{
		updater: String,
		date: Date
	}]

}, { collection: 'notes' })

NoteSchema.set('timestamps', true)
NoteSchema.set('toJSON', { virtuals: true })
NoteSchema.set('toObject', { virtuals: true })

module.exports = (mongoose.models?.Notes || mongoose.model('Notes', NoteSchema));