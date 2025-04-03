import sharp from 'sharp';
import { put, del } from '@vercel/blob';
import randomStr from 'randomstring';

import dbConnect from "lib/database";
import { logServerDatabaseCall } from "lib/logger";
import Gallery from "lib/models/gallery";
import Counters from 'lib/models/counters';

/**
 * Function to retrieve all gallery pictures
 *
 * @oaram [category] - the category to filter gallery images by
 * @param [start] - the number of images to skip before we start returning back image metadata
 * @poaram [end] - the last image to load (by index)
 * 
 * @param request
 * @returns {Promise<NextResponse>}
 */
export async function getGalleryImages(category = '', start = 0, end = 10000) {
	await dbConnect();
	logServerDatabaseCall('lib/http/galleryDAO/getGalleryImages', start, end);

	let filterParams = {};
	if (category) {
		filterParams.category = category;
	}

	try {
		const images = await Gallery.find(filterParams).sort({ index : 1 }).skip(start).limit(end).exec();
		return images;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function getGalleryCount() {
	await dbConnect();
	logServerDatabaseCall('lib/http/galleryDAO/getGalleryCount');

	try {
		return await Gallery.countDocuments({});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to add a new instance of gallery metadata
 *
 * @param {Object} metadata - the metadata to upload
 */
export async function addGalleryImage(metadata) {
	await dbConnect();
	logServerDatabaseCall('lib/http/galleryDAO/addGalleryImage', ...arguments);

	// Pull the ID number from our counters collection and increment the ID sequencer accordingly
	const counterRecord = await Counters.findByIdAndUpdate('gallery', { $inc: { seq: 1 } }).exec();
	const galleryDocument = {
		_id: counterRecord.seq,
		...metadata
	};
	await Gallery.create(galleryDocument);
	return galleryDocument;
}

export async function updateGalleryImageData(metadata) {
	await dbConnect();
	logServerDatabaseCall('lib/http/galleryDAO/updateGalleryImageData', metadata);

	const updateResult = await Gallery.updateOne({ _id: metadata._id, name: metadata.name }, metadata, { upsert: false });

	if (updateResult.modifiedCount !== 1) {
		throw new Error('Database did not update anything');
	}
	return true;
}

/**
 * Function to remove individual instance of gallery metadata
 *
 * @param {Object} metadata
 */
export async function deleteGalleryImage(name, index) {
	await dbConnect();
	logServerDatabaseCall('lib/http/galleryDAO/deleteGalleryImage');

	try {
		const oldGalleryCount = await getGalleryCount();
		const dbResult = await Gallery.deleteOne({ index: index, name: name });

		// Ensure that after the picture is deleted, the gallery is re-indexed
		let bulkOps = [];
		for (let i = index + 1; i <= oldGalleryCount; i += 1) {
			bulkOps.push({
				updateOne: {
					filter: { index: i },
					update: { index: i - 1 }
				}
			});
		}
		await Gallery.bulkWrite(bulkOps);

		return (dbResult.deletedCount === 1);
	} catch (error) {
		console.error(error);
		return false;
	}
}

/**
 * Function to upload a new photo directly to Vercel's Blob storage service
 *
 * @param {Object} imageFile
 */
export async function uploadToVercel(imageFile) {
	logServerDatabaseCall('lib/http/galleryDAO/uploadToVercel', ...arguments);

	const imageBlob = await (new Blob([imageFile])).arrayBuffer();
	const sharpImage = sharp(imageBlob).withMetadata();

	try {
		// Generate a random name for the new image prior to upload
		const generatedName = randomStr.generate({ length : 9 }) + '.' + imageFile.name.split('.').pop();

		// Create three separate copies of the image, each in different sizes
		const processedImage = {
			galleria: sharpImage.resize(null, 750),
			original: imageFile
		};

		// Upload to Vercel using their Blob API
		const galleriaBlob = await put(process.env.BLOB_DIR + 'gallery/galleria/' + generatedName, processedImage.galleria, { access: 'public' });
		const originalBlob = await put(process.env.BLOB_DIR + 'gallery/original/' + generatedName, processedImage.original, { access: 'public' });

		const metadata = {
			originalUrl: originalBlob.url,
			galleriaUrl: galleriaBlob.url,
			name: originalBlob.pathname.split('/').pop(),
			alt: originalBlob.pathname.split('/').pop()
		};

		return metadata;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * Function to delete an existing photo from Vercel's Blob storage service
 *
 * @param {String}
 * @param {String}
 */
export async function deleteFromVercel(originalUrl, galleriaUrl) {
	// Note that Vercel's API service will not throw any errors here, so no point in wrapping this logic in a try/catch
	await del([originalUrl, galleriaUrl]);
}