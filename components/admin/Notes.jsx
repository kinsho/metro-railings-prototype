'use client'

// @TODO - Make this component look pretty on mobile
import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';

import { UserMapContext } from 'app/admin/userContext';

import NoteRecord from 'components/admin/NoteRecord';
import { toastValidationError } from 'components/CustomToaster';

import { createNoteTask, fetchNotesByIds } from 'actions/note';

import { serverActionCall } from 'lib/http/clientHttpRequester';
import { sortNotes } from 'lib/utils';
import { validateEmpty, runValidators } from 'lib/validators/inputValidators';

import styles from 'public/styles/page/notes.module.scss';

const NoteManager = ({ order, existingNotes, specialNotes, noteRefs, inSpanish }) => {

	const [newNote, setNewNote] = useState({
		text: '',
		type: 'note',
		assignTo: '',
		orderId: order?._id || null
	});
	const [notes, setNotes] = useState(existingNotes || []);
	const [noteIds, setNoteIds] = useState(noteRefs || []);
	const userMap = useContext(UserMapContext);

	// ---------- Validation functions

	// ---------- Client-side error tests
	const newNoteValidationFields = [
		{ prop: newNote.text, validator: validateEmpty, errorMsg: 'A note/task is meaningless without any text.' }
	];

	const updateNote = (event) => {
		const prop = event.currentTarget.name;
		const value = event.currentTarget.value;

		let changedNote = {
			...newNote,
			[prop]: value
		};

		if (prop === 'type' && value !== 'task') {
			changedNote.assignTo = '';
		}

		setNewNote(changedNote);
	};

	const saveNote = async () => {
		const errors = runValidators(newNoteValidationFields);

		if (errors.length === 0) {
			// Save the new note and display a proper toast message in the process
			const noteType = (newNote.type === 'task' ? 'task' : 'note');
			const serverResponse = await serverActionCall(createNoteTask, newNote, {
				loading: 'Adding a new ' + noteType + '..',
				success: 'A new ' + noteType + ' has been added.',
				error: 'Something went wrong when trying to register a new ' + noteType + '. Please try again.'
			});

			if (serverResponse.success) {
				// Add the new note and make sure the note collection is properly sorted
				let allNotes = [...notes, JSON.parse(serverResponse.note)];
				sortNotes(allNotes);
				setNotes(allNotes);

				// Clear out the textarea in the new note form as well
				setNewNote({
					...newNote,
					text: '',
					assignTo: '',
				});
			}
		} else {
			toastValidationError(errors);
		}
	}

	const loadAllNotes = async () => {
		try {
			const serverResponse = await serverActionCall(fetchNotesByIds, { noteIds: noteIds }, {
				loading: 'Fetching all the notes written for order ' + order._id + '...',
				error: 'Something went awry when trying to recover all the notes belonging to order ' + order._id + '!'
			});

			if (serverResponse.success) {
				let allNotes = [...notes, ...(JSON.parse(serverResponse.notes))];
				sortNotes(allNotes);
				setNotes(allNotes);

				// Empty out the collection tracking notes that have yet to be fetched, as they've all been fetched at this point
				setNoteIds([]);
			}
		} catch (error) {
			console.error(error);
			toast.error('Something odd happened with the server. Please try again.');
		}
	};

	return (
		<>
			<div className={ styles.noteListing }>
				<textarea
					className={ styles.newNoteTextContainer }
					placeholder={ inSpanish ? 'Escribe una nueva nota aqui' : 'Write a new note here' }
					value={ newNote.text }
					name='text'
					onChange={ updateNote }
				/>

				<div className={ styles.newNoteActions }>
					<span className={ styles.notePropField }>
						<label className={ styles.notePropFieldLabel }>Type</label>
						<select
							className={ styles.notePropFieldInput }
							onChange={ updateNote }
							name='type'
							value={ newNote.type }
						>
							<option value='note'>Note</option>
							<option value='task'>Task</option>
							<option value='shop'>Shop</option>
						</select>
					</span>

					<span className={ styles.notePropField }>
						<label className={ styles.notePropFieldLabel }>Assign To</label>
						<select
							className={ styles.notePropFieldInput }
							onChange={ updateNote }
							name='assignTo'
							value={ newNote.assignTo }
							disabled={ newNote.type !== 'task' }
						>
							<option value=''>Select a username...</option>
							{ Object.keys(userMap).map((username, index) => {
								return (
									<option key={ order._id + '-note-author-' + index } value={ username }>{ userMap[username] }</option>
								);
							})}
						</select>
					</span>

					<span className={ styles.notePropField }>
						<button className={ styles.notePropFieldSubmitButton } type='button' onClick={ saveNote }>
							{ inSpanish ? 'Guardar Nota' : 'Save Note/Task' }
						</button>
					</span>
				</div>
			</div>

			<div className={ styles.noteRecordsContainer }>
				{ specialNotes.length ? (
					specialNotes.map((note) => {
						return (
							<NoteRecord note={ note } inSpanish={ inSpanish } order={ order } key={ order._id + '-note-' + note._id } />
						);
					})
				) : null }
				{ notes.length ? (
					notes.map((note) => {
						return (
							<NoteRecord note={ note } inSpanish={ inSpanish } order={ order } key={ order._id + '-note-' + note._id } />
						);
					})
				) : null }
			</div>

			{ /* If this order has notes that haven't been fully fetched, set up a link to fetch those notes in full */ }
			{ noteIds.length ? (
				<div className={ styles.noteLazyLoadLink } onClick={ loadAllNotes }>
					{ inSpanish ? 'Cargar Todos Las Notas...' : 'Load All Notes...' }
				</div>
			) : null }
		</>
	);
}

export default NoteManager;