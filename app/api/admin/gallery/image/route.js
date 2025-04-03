import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { addGalleryImage, deleteGalleryImage, deleteFromVercel, updateGalleryImageData } from 'lib/http/galleryDAO';

/**
 * Function to upload metadata regarding a new gallery picture into our database
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request) {
	const metadata = await request.json();

	try {
		const processedMetadata = await addGalleryImage(metadata);
		return NextResponse.json(processedMetadata, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Server issue' }, { status: 500 });
	}
}

/**
 * Function to delete an image from our gallery
 *
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request) {
	const params = request.nextUrl.searchParams;

	try {
		if (await deleteGalleryImage(params.get('name'), parseInt(params.get('index'), 10))) {
			deleteFromVercel(params.get('originalUrl'), params.get('galleriaUrl'));
			revalidatePath('/admin/gallery');
			return NextResponse.json({}, { status: 200 });
		} else {
			return NextResponse.json({ error: 'Error attempting to delete a gallery image from the database' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Strange issue when trying to delete a gallery image' }, { status: 500 });
	}
}

/**
 * Method to guide the upload of media directly to Vercel from the client
 *
 * @param request
 * @param payload
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
	const imageData = await request.json();

	try {
		await updateGalleryImageData(imageData);
		return NextResponse.json({}, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json( { error: 'Server is menopausal' }, { status: 500 });
	}
}