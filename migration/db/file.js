import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	name: String,

	orderId: {
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

	url: {
		type: String,
		required: true
	},

	uploader: {
		type: String,
		required: true
	}
}, { collection: 'files' });

FileSchema.set('timestamps', true)
FileSchema.set('toJSON', { virtuals: true })
FileSchema.set('toObject', { virtuals: true })

export default mongoose.model('File', FileSchema);