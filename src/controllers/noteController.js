const noteService = require('../services/noteService');
const userAccessService = require('../services/userAccessService');

const CustomError = require('../resources/error');
const { generalSanitization } = require('../resources/sanitization');
const { titleValidation, categoryCodeExists } = require('../resources/validations');
const { extractDataFromToken } = require('../resources/userAuth');
const { isObjectEmpty } = require('../resources/utils');

exports.createNewNote = async (req, res, next) => {
	console.log('[createNewNote]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const { title, innerContent, categoryCode } = req.body;

		// sanitization
		const cleanNoteInfo = {
			title: title === null ? null : generalSanitization(title),
			innerContent: generalSanitization(innerContent),
			categoryCode: categoryCode === null ? null : generalSanitization(categoryCode)
		}

		// validations
		if (cleanNoteInfo.title && !titleValidation(cleanNoteInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanNoteInfo.categoryCode && !categoryCodeExists(userId, cleanNoteInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		const createdNoteId = await noteService.createNewNote(userId, cleanNoteInfo);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(201).send({ tokenCookieData, code: 'CREATED', result: createdNoteId, success: true });
	} catch (error) {
		next(error);
	}
}

exports.getUserNotes = async (req, res, next) => {
	console.log('[getUserNotes]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const notesList = await noteService.getUserNotes(userId);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'FOUND', result: notesList, success: true });
		
	} catch (error) {
		next(error);
	}
}

exports.updateNote = async (req, res, next) => {
	console.log('[updateNote]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		
		const { noteId } = req.params;

		if (!noteId) {
			throw CustomError('NOTE_ID_NOT_FOUND', 400);
		}

		if (! await noteService.getNoteById(noteId)) {
			throw CustomError('NOTE_NOT_FOUND', 404);
		}

		const { title, innerContent, categoryCode } = req.body;

		console.log('req.body: ', { title, innerContent, categoryCode })

		const cleanNoteInfo = {};

		if (title !== null) cleanNoteInfo.title = generalSanitization(title);
		if (innerContent !== null) cleanNoteInfo.innerContent = generalSanitization(innerContent);
		if (categoryCode !== null) cleanNoteInfo.categoryCode = generalSanitization(categoryCode);

		// validations
		if (isObjectEmpty(cleanNoteInfo)) {
			console.log('nothing to change')
			res.status(200).send({ tokenCookieData, code: 'OK', success: true });
			return;
		}

		if (cleanNoteInfo.title && !titleValidation(cleanNoteInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanNoteInfo.categoryCode && !categoryCodeExists(userId, cleanNoteInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		await noteService.updateNoteInfo(noteId, cleanNoteInfo);

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'UPDATED', success: true });
		
	} catch (error) {
		next(error);
	}
}

exports.deleteNote = async (req, res, next) => {
	console.log('[deleteNote]');

	try {
		const { noteId } = req.params;

		if (!noteId) {
			throw CustomError('NOTE_ID_NOT_FOUND', 400);
		}

		if (! await noteService.getNoteById(noteId)) {
			throw CustomError('NOTE_NOT_FOUND', 404);
		}

		await noteService.deleteNote(noteId);

		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'DELETED', success: true });
		
	} catch (error) {
		next(error);
	}
}