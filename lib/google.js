import outscraper from 'outscraper';

import { getReviews, uploadReviews } from 'lib/http/googleDAO';

export async function getGoogleReviews() {

	// Pull the reviews either from our database or directly from Outscraper
	const existingReviews = await getReviews();
	if (existingReviews.length === 0) {
		const client = new outscraper(process.env.OUTSCRAPER_API_KEY);
		const response = await client.googleMapsReviews([process.env.GOOGLE_PLACE_ID], 50);

		// Pull the reviews out from the response and reduce all reviews down to only relevant data
		const reviews = response[0].reviews_data;
		const processedReviews = reviews.map((review) => {
			return {
				author: review.author_title,
				text: review.review_text,
				images: review.review_img_urls?.slice(0, 3) || [],
				rating: review.review_rating,
				date: review.review_datetime_utc
			};
		}).filter((review) => review.text);

		// Upload the reviews to our database so that we don't need to reference Outscraper again for a while
		await uploadReviews(processedReviews);

		return processedReviews;
	} else {
		return existingReviews;
	}
}