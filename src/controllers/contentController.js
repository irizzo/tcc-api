const contentModel = require('../models/contentModel');
const userAccessService = require('../services/userAccessService');

const CustomError = require('../resources/error');
const { generalSanitization } = require('../resources/sanitization');
const { titleValidation } = require('../resources/validations');
const { extractDataFromToken } = require('../resources/userAuth');
const { isObjectEmpty } = require('../resources/utils');

exports.createNewContent = async (req, res, next) => {
	console.log('[createNewContentController]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');

		const { title, innerContent } = req.body;

		const cleanContentInfo = {
			title: generalSanitization(title),
			innerContent: generalSanitization(innerContent),
		}

		if (!titleValidation(cleanContentInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		const createdContentId = await contentModel.createDbContent(cleanContentInfo);
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(201).send({ tokenCookieData, code: 'CREATED', result: createdContentId, success: true });
		
	} catch (error) {
		next(error);
	}
}

exports.getAllContents = async (req, res, next) => {
	console.log('[getAllContentsController]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const contentsList = await contentModel.getDbContents();
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'FOUND', result: contentsList, success: true });

	} catch (error) {
		next(error);
	}
}

exports.updateContent = async (req, res, next) => {
	console.log('[updateContentController]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		const { contentId } = req.params;

		if (!contentId) {
			throw CustomError('FAILED', 400)
		}

		if (! await contentModel.findDbContentById(contentId) ) {
			throw CustomError('NOT_FOUND', 404);
		}

		const { title, innerContent } = req.body;
		console.log('req.body: ', { title, innerContent })

		const cleanContentInfo = {};
		if (title !== null) cleanContentInfo.title = generalSanitization(title);
		if (innerContent !== null) cleanContentInfo.innerContent = generalSanitization(innerContent);

		if (isObjectEmpty(cleanContentInfo)) {
			console.log('nothing to change');
			res.status(200).send({ tokenCookieData, code: 'OK', success: true });
			return;
		}

		if (cleanContentInfo.title && !titleValidation(cleanContentInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		await contentModel.updateDbContent(contentId, cleanContentInfo);
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'UPDATED', success: true });

	} catch (error) {
		next(error);
	}
}

exports.deleteContent = async (req, res, next) => {
	console.log('[deleteContentController]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		const { contentId } = req.params;

		if (!contentId) {
			throw CustomError('FAILED', 400)
		}

		if (! await contentModel.findDbContentById(contentId)) {
			throw CustomError('NOT_FOUND', 404);
		}

		await contentModel.deleteDbContent(contentId);

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ code: 'DELETED', success: true });
	} catch (error) {
		next(error);
	}
}