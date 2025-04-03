import dbConnect from "lib/database";
import { logServerDatabaseCall } from "lib/logger";
import GoogleReview from "lib/models/googleReview";

/**
 * Function to retrieve all google reviews
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function getReviews() {
	await dbConnect();
	logServerDatabaseCall('api/google/getReviews');

	try {
		const reviews = await GoogleReview.find({ rating: 5 }).sort({ date : -1 }).exec();
		return reviews;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to add google reviews to our collection
 *
 * @param request
 */
export async function uploadReviews(reviews) {
	await dbConnect();
	logServerDatabaseCall('api/google/uploadReviews');

	let ops = [];
	for (let i = 0; i < reviews.length; i += 1) {
		ops.push({
			updateOne: {
				filter: { author: reviews[i].author, date: reviews[i].date },
				update: reviews[i],
				upsert: true
			}
		});
	}

	try {
		await GoogleReview.bulkWrite(ops, { skipValidation: false });
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}