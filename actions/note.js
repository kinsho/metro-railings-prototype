'use server'

import { cookies } from 'next/headers';

import {
	getNotesByIds,
	addNoteTask,
	updateNoteTask
} from 'lib/http/notesDAO';

import {
	addNewNoteTaskToOrder,
	reclassifyNote
} from 'lib/http/ordersDAO';

/**
 * Server action designed to retrieve fully formed notes given node IDs
 *
 * @param data - the list of IDs to use to determine which notes to fetch
 */
export async function fetchNotesByIds(data) {
	try {
		const notes = await getNotesByIds(data.noteIds);
		return { success: true, notes: JSON.stringify(notes) };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

/**
 * Server action designed to generate a new note or task in our system and update other models as well depending on context
 *
 * @param data - the order object to model the invoice off
 */
export async function createNoteTask(data) {
	try {
		const username = JSON.parse(cookies().get('user').value).username;
		const processedNote = await addNoteTask(data, username);
		if (data.orderId) {
			await addNewNoteTaskToOrder(processedNote);
		}
		return { success: true, note: JSON.stringify(processedNote) };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

/**
 * Server action designed to update the state of a task
 *
 * @param data - the state data to update
 */
export async function updateTaskStatus(data) {
	const { noteId, orderId, newState } = data;

	try {
		const username = JSON.parse(cookies().get('user').value).username;
		await updateNoteTask(noteId, {
			status: newState,
			closer: username
		}, username);

		if (orderId) {
			await reclassifyNote(noteId, orderId);
		}

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}
