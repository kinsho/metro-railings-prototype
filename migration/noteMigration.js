import { getAllNotes, updateNote } from './db/notesDAO.js';

const notes = await getAllNotes();

for (let i = 0; i < notes.length; i += 1) {
	console.log('Migrating note ' + notes[i]._id);
	await updateNote(notes[i]);
}

console.log('Done!');
process.exit();