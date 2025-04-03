import dbConnect from './driver.js';
import Notes from './note.js';

import { MIGRATION_USER } from '../env.js';

export async function getAllNotes() {
	await dbConnect();

	try {
		return await Notes.find().sort({ _id: 1 }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function updateNote(note) {
	await dbConnect();

	if (note.type === 'task' || note.type === 'shop') {
		note.assignFrom = note.author;
	} else if (note.type === 'note') {
		delete note.assignTo;
		note.status = '';
	}

	note.dates.lastModified = new Date();
	note.updateLog = [{
		updater: MIGRATION_USER.USERNAME,
		date: new Date()
	}];

	try {
		await Notes.findOneAndUpdate({
			_id: note._id,
		}, note, {
			upsert: false
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

export async function findNotesByOrder(orderId) {
	await dbConnect();

	try {
		return await Notes.find({ orderId: orderId }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}