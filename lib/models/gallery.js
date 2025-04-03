import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({

	_id: Number,

	originalUrl: String,
	galleriaUrl: String,
	name: String,
	alt: String,
	index: Number,
	category: String,

	uploader: String,
	uploadDate: Date,

	tags: [{
		type: String,
		enum: ['cable', 'glass']
	}],

}, { collection: 'gallery' });

GallerySchema.set('timestamps', true);
GallerySchema.set('toJSON', { virtuals: true });
GallerySchema.set('toObject', { virtuals: true });

module.exports = (mongoose.models?.Gallery || mongoose.model("Gallery", GallerySchema));