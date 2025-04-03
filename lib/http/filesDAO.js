import sharp from 'sharp';
import randomStr from 'randomstring';
import { put, del } from '@vercel/blob';

import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Files from 'lib/models/file';
import Counters from 'lib/models/counters';

/**
 * Function to save a new file into the database
 *
 * @param {Object} newFile - processed file to store
 * @param {Number} orderId - the ID of the order to associate with this file
 * @param {String} uploader - the ID of the user uploading this file
 */
export async function saveNewFile(newFile, orderId, uploader) {
	await dbConnect();
	logServerDatabaseCall('lib/http/filesDAO/saveNewFile');

	try {
		// Pull the ID number from our counters collection and increment the ID sequencer accordingly
		const countersResult = await Counters.findByIdAndUpdate('gallery', { $inc: { seq: 1 } }).exec();
		newFile._id = countersResult.seq;

		const processedFile = await Files.create({
			...newFile,
			orderId: orderId,
			uploader: uploader
		});
		return processedFile;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to delete a file from the database
 *
 * @param {Number} fileId - the ID of the file to remove from the database
 */
export async function deleteFile(fileId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/filesDAO/deleteFile');

	try {
		const dbResult = await Files.deleteOne({ _id: fileId });
		return (dbResult?.deletedCount === 1);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to fetch all files associated with a particular order
 *
 * @param {Number} orderId - the ID of the order in context here
 */
export async function getFilesByOrder(orderId) {
	await dbConnect();
	logServerDatabaseCall('lib/http/filesDAO/getFilesByOrder');

	try {
		return await Files.find({ orderId: orderId }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to upload a new photo directly to Vercel's Blob storage service
 *
 * @param {File} imageFile
 * @param {Number} orderId
 */
export async function uploadImageToVercel(imageFile, orderId) {
	try {
		const imageBlob = await (new Blob([imageFile])).arrayBuffer();

		// Generate a random name for the new image prior to upload
		const generatedName = randomStr.generate({ length : 9 }) + '.' + imageFile.name.split('.').pop();

		// Compress the image as needed
		const sharpImage = await sharp(imageBlob).withMetadata().jpeg({ mozjpeg: true });

		// Upload to Vercel using their Blob API
		const fileBlob = await put(process.env.BLOB_DIR + 'orders/' + orderId + '/' + generatedName, sharpImage, { access: 'public' });

		return {
			...fileBlob,
			name: imageFile.name
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * Function to upload a generic file directly to Vercel's Blob storage service
 *
 * @param {File} imageFile
 * @param {Number} orderId
 */
export async function uploadFileToVercel(newFile, orderId) {
	try {
		const blob = await (new Blob([newFile])).arrayBuffer();

		// Generate a random name for the new image prior to upload
		const generatedName = randomStr.generate({ length : 9 }) + '.' + newFile.name.split('.').pop();

		// @TODO = add in logic to compress the file as needed

		// Upload to Vercel using their Blob API
		const fileBlob = await put(process.env.BLOB_DIR + 'orders/' + orderId + '/' + generatedName, blob, { access: 'public' });

		return {
			...fileBlob,
			name: newFile.name
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

/**
 * Function to delete an existing photo from Vercel's Blob storage service
 *
 * @param {String} the URL of the image
 */
export async function deleteFromVercel(originalUrl) {
	// Note that Vercel's API service will not throw any errors here, so no point in wrapping this logic in a try/catch
	await del([originalUrl]);
}