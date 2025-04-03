import dbConnect from './driver.js';
import Files from './file.js';
import Counters from './counter.js';

import { suffixToExtensionTranslator } from '../lib/dictionary.js'
import { MIGRATION_USER, GENERIC_PICTURE } from '../env.js';

export async function addFile(oldFile, orderId) {
	await dbConnect();

// Pull the ID number from our counters collection and increment the ID sequencer accordingly
	const countersResult = await Counters.findByIdAndUpdate('gallery', { $inc: { seq: 1 } }).exec();
	const contentType = suffixToExtensionTranslator[oldFile.name.split('.').pop().toLowerCase()];
	const newFile = {
		_id: countersResult.seq,
		name: oldFile.name,
		orderId: orderId,
		contentDisposition: '',
		contentType: contentType || '',
		pathname: 'DROPBOX',
		url: oldFile.shareLink || GENERIC_PICTURE,
		uploader: MIGRATION_USER.USERNAME
	};

	try {
		return await Files.create(newFile);
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function findFilesByOrder(orderId) {
	await dbConnect();

	try {
		return await Files.find({ orderId: orderId }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}