import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { handleUpload } from '@vercel/blob/client';
import randomStr from 'randomstring';

/**
 * Class to upload media directly to Vercel from the client
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export default async function trackImageUpload(request, payload) {

	const userCookie = cookies().get('user');

	try {
		const jsonResponse = await handleUpload({
			payload,
			request,
			onBeforeGenerateToken: (pathname) => {

				let token = '';

				if (userCookie) {
					token += JSON.parse(userCookie).username + ' - ';
				}
				return {
					allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
					tokenPayload: JSON.stringify({
						path: pathname,
						token: token + randomStr.generate({ length : 6 })
					}),
				};
			},
			onUploadCompleted: ({ blob, tokenPayload }) => {

				console.log('Media has been uploaded -- ', blob, tokenPayload);

				try {
					return { blob, tokenPayload };
				} catch (error) {
					throw new Error('Could not update user');
				}
			},
		});

		return NextResponse.json(jsonResponse);
	} catch (error) {
		// Do note that the webhook will retry 5 times waiting for a status 200;
		console.error(error);
		return NextResponse.json({ error: "Upload issue" },{ status: 400 });
	}
}