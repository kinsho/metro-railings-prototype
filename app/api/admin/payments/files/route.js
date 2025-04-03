import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { handleUpload } from '@vercel/blob/client';

/**
 * Class to upload media directly to Vercel from the client
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
	const userCookie = cookies().get('user');
	const body = await request.json();

	try {
		// Note that the two functions being passed into handleUpload need to be explicitly async, regardless of the
		// presence of the await keyword 
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: (pathname, clientPayload) => {

				console.log('About to upload an image - ' + pathname);
				console.log('Related metadata payload:');
				console.log(clientPayload);

				return {
					allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
					tokenPayload: JSON.stringify({
						uploader: JSON.parse(userCookie.value).username,
						orderId: clientPayload.orderId
					}),
				};
			},
			onUploadCompleted: ({ blob, tokenPayload }) => {

				console.log('Media has been uploaded -- ', blob, tokenPayload);
			},
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		// Do note that the webhook will retry 5 times waiting for a status 200;
		console.error(error);
		return NextResponse.json({ error: "Upload issue" },{ status: 500 });
	}
}