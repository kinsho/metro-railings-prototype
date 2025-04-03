import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	contentDisposition: {
		type: String
	},

	contentType: {
		type: String
	},

	pathname: {
		type: String,
		required: true
	},
	name: String,

	url: {
		type: String,
		required: true
	},

	uploader: {
		type: String,
		required: true
	},

	orderId: {
		type: Number
	}
}, { collection: 'files' });

FileSchema.set('timestamps', true)
FileSchema.set('toJSON', { virtuals: true })
FileSchema.set('toObject', { virtuals: true })

module.exports = (mongoose.models?.File || mongoose.model('File', FileSchema));