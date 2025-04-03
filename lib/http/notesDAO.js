import dbConnect from 'lib/database';
import { logServerDatabaseCall } from 'lib/logger';

import Notes from 'lib/models/note';
import Counters from 'lib/models/counters';

/**
 * Function designed to record information regarding who and when updated a given note
 */
const recordUpdateInfo = (username) => {
	return {
		updateLog: { updater: username, date: new Date() }
	};
}

/**
 * Function designed to transform the text of a note so that it can be rendered directly as HTML
 */
const sanitizeNoteText = (noteText) => {
	return noteText.split('\n').join('<br />');
}

/**
 * Function to retrieve all notes, filtered by whatever parameters are passed
 *
 * @param filters - the filters to pass directly to MongoDB when retrieving the results
 *
 * @returns {Promise<NextResponse>}
 */
export async function getNotes(filters) {
	await dbConnect();
	logServerDatabaseCall('lib/http/notesDAO/getNotes');

	try {
		return await Notes.find(filters).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to retrieve a group of notes given all their IDs
 *
 * @param noteIds - the collection of IDs to use to determine which notes to fetch
 */
export async function getNotesByIds(noteIds) {
	await dbConnect();
	logServerDatabaseCall('lib/http/notesDAO/getNotesById');

	try {
		return await Notes.find({ _id: { $in: noteIds } }).exec();
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to add a new note into our database
 *
 * @param newNote - the new note to process and insert into the database
 * @param username - the name of the user authoring the note
 *
 * @returns {Object} - the newly processed note
 */
export async function addNoteTask(newNote, username) {
	await dbConnect();
	logServerDatabaseCall('lib/http/notesDAO/addNote');

	newNote.dates = { created: new Date(), lastModified: new Date() };
	newNote.author = username;
	newNote.text = sanitizeNoteText(newNote.text);

	if (newNote.type === 'task') {
		newNote.assignFrom = username;
		newNote.status = 'open';
	}

	try {
		// Pull the ID number from our counters collection and increment the ID sequencer accordingly
		const countersResult = await Counters.findByIdAndUpdate('notes', { $inc: { seq: 1 } }).exec();

		// Add the new note inside the notes collection
		const processedNote = await Notes.create({
			_id: countersResult.seq,
			$push: recordUpdateInfo(username),
			...newNote
		});

		return processedNote;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

/**
 * Function to update a single note with whatever properties are being passed
 *
 * @param noteId - the ID of the note to update
 * @param newProps - the properties to update/add
 * @param username - the name of the user updating the note
 *
 * @returns {Promise<NextResponse>}
 */
export async function updateNoteTask(noteId, newProps, username){
	await dbConnect();
	logServerDatabaseCall('lib/http/notesDAO/updateNoteTask');

	try {
		return await Notes.findOneAndUpdate({
			_id: noteId,
		}, {
			...newProps,
			'dates.lastModified': new Date(),
			$push: recordUpdateInfo(username)
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}