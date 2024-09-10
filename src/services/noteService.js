const noteModel = require('../models/noteModel');

exports.createNewNote = async (userId, newNoteInfo) => {
	console.log('[createNewNote] (service)');
	try {
		const noteInfo = {
			...newNoteInfo,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
			userId
		};

		const createdNoteId = await noteModel.createDbNote(noteInfo);
		return createdNoteId;
	} catch (error) {
		console.log(`(service) error = ${error} `);
		throw error;
	}
}

exports.getUserNotes = async (userId) => {
	console.log('[getUserNotes] (service)');

	try {
		const notesList = await noteModel.getUserNotes(userId);

		if (!notesList || notesList.length === 0) {
			console.log('noteList vazia');

			return [];
		}

		return notesList;

	} catch (error) {
		throw error;
	}
}

exports.getNoteById = async (noteId) => {
	console.log('[getNoteById] (service)');

	try {
		const match = await noteModel.findNoteById(noteId);

		if (!match) {
			return false
		}

		if (match.startDate) {
			console.log('[getUserNoteById] match.startDate: ', match.startDate);
			match.startDate = convertStampToDate(match.startDate)
		}

		if (match.endDate) {
			console.log('[getUserNoteById] match.endDate: ', match.endDate);
			match.endDate = convertStampToDate(match.endDate)
		}

		return match;

	} catch (error) {
		throw error;
	}
}

exports.updateNoteInfo = async (noteId, newInfo) => {
	console.log('[updateNoteInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: new Date(Date.now()) };
		await noteModel.updateNote(noteId, updatedInfo);
		return;

	} catch (error) {
		throw error;
	}
}

exports.deleteNote = async (noteId) => {
	console.log('[deleteNote] (service)');
	try {
		await noteModel.deleteNote(noteId);
		return;
	} catch (error) {
		throw error;
	}
}