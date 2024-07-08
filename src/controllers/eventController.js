const eventService = require('../services/eventService');
const userAccessService = require('../services/userAccessService');

const CustomError = require('../resources/error');
const { generalSanitization } = require('../resources/sanitization');
const { dueDateValidation, endDateValidation, titleValidation, categoryCodeExists } = require('../resources/validations');
const { extractDataFromToken } = require('../resources/userAuth');

exports.createNewEvent = async (req, res, next) => {
	console.log('[createNewEvent] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const { title, description, startDate, endDate, categoryCode } = req.body;

		// sanitization
		const cleanEventInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			startDate: startDate === null ? null : new Date(startDate),
			endDate: endDate === null ? null : new Date(endDate),
			categoryCode: categoryCode === null ? null : generalSanitization(categoryCode)
		};

		// validations
		if (!titleValidation(cleanEventInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (!dueDateValidation(cleanEventInfo.startDate)) {
			throw CustomError('INVALID_START_DATE', 400);
		}

		if (!endDateValidation(cleanEventInfo.startDate, cleanEventInfo.endDate)) {
			throw CustomError('INVALID_END_DATE', 400);
		}

		if (cleanEventInfo.categoryCode && !categoryCodeExists(userId, cleanEventInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		const createdEventId = await eventService.createNewEvent(userId, cleanEventInfo);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(201).send({ tokenCookieData: tokenCookieData, code: 'CREATED', result: createdEventId, success: true });

	} catch (error) {
		next(error);
	}
}

exports.getUserEvents = async (req, res, next) => {
	console.log('[getUserEvents] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const eventsList = await eventService.getUserEvents(userId);
		
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'FOUND', result: eventsList, success: true });
		
	} catch (error) {
		next(error);
	}
}

exports.getEventInfo = async (req, res, next) => {
	console.log('[getEventInfo] (controller)');
	try {
		const { eventId } = req.params;
		
		if (!eventId) {
			throw CustomError('EVENT_ID_NOT_FOUND', 400);
		}
		
		const eventFound = await eventService.getUserEventById(eventId);
		if (!eventFound) {
			throw CustomError('EVENT_NOT_FOUND', 404);
		}
		
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'FOUND', result: eventFound, success: true });
	} catch (error) {
		next(error);
	}
}

exports.updateEventDates = async (req, res, next) => {
	console.log('[updateEventDates] (controller)');
	try {
		const { eventId } = req.params;
		
		if (!eventId) {
			throw CustomError('EVENT_ID_NOT_FOUND', 400);
		}
		
		if (! await eventService.getUserEventById(eventId)) {
			throw CustomError('EVENT_NOT_FOUND', 404);
		}
		
		const { startDate, endDate } = req.body;
		
		const cleanDates = {
			startDate: new Date(startDate),
			endDate: new Date(endDate),
		}

		if (!dueDateValidation(cleanDates.startDate)) {
			throw CustomError('INVALID_START_DATE' , 400);
		}
		
		if (!endDateValidation(cleanDates.startDate, cleanDates.endDate)) {
			throw CustomError('INVALID_END_DATE', 400);
		}
		
		await eventService.updateEventDates(eventId, cleanDates);

		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'UPDATED', success: true });

	} catch (error) {
		next(error);
	}
}

exports.updateEvent = async (req, res, next) => {
	console.log('[updateEvent] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const { eventId } = req.params;

		if (!eventId) {
			throw CustomError('EVENT_ID_NOT_FOUND', 400);
		}

		if (! await eventService.getUserEventById(eventId)) {
			throw CustomError('EVENT_NOT_FOUND', 404);
		}
		
		const { title, description, categoryCode } = req.body;
		
		const cleanEventInfo = {
			title: title === null ? null : generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			categoryCode: categoryCode === null ? null : generalSanitization(categoryCode)
		};
		
		// validations
		if (!cleanEventInfo.title && !cleanEventInfo.description && !cleanEventInfo.categoryCode) {
			// nothing to change
			res.status(200).send({ tokenCookieData: tokenCookieData, code: 'OK', success: true });
			return;
		}
		
		if (cleanEventInfo.title && !titleValidation(cleanEventInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}
		
		if (cleanEventInfo.categoryCode && !categoryCodeExists(userId, cleanEventInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}
		
		await eventService.updateEventInfo(eventId, cleanEventInfo);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'UPDATED', success: true });

	} catch (error) {
		next(error);
	}
}

exports.deleteEvent = async (req, res, next) => {
	console.log('[deleteEvent] (controller)');
	try {
		const { eventId } = req.params;

		if (!eventId) {
			throw CustomError('EVENT_ID_NOT_FOUND', 400);
		}

		if (! await eventService.getUserEventById(eventId)) {
			throw CustomError('EVENT_NOT_FOUND', 404);
		}

		await eventService.deleteEvent(eventId);

		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'DELETED', success: true });
	} catch (error) {
		next(error);
	}
}