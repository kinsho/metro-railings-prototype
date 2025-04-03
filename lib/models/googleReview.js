import mongoose from "mongoose";

const GoogleReviewSchema = new mongoose.Schema({

	author: String,
	text: String,
	date: Date,

	rating: {
		type: Number,
		enum: [0, 1, 2, 3, 4, 5]
	},

	images: [String]
}, { collection: 'googleReviews' })

module.exports = (mongoose.models?.GoogleReviews || mongoose.model("GoogleReviews", GoogleReviewSchema));