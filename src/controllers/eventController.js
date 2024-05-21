const eventService = require('../services/eventService');

const CustomError = require('../resources/error');
const { generalSanitization } = require('../resources/sanitization');
const { dueDateValidation, endDateValidation, titleValidation, categoryCodeExists } = require('../resources/validations');
const { getDataFromToken } = require('../resources/userAuth');

async function createNewEvent(req, res, next) {
	console.log('[createNewEvent] (controller)');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");

		const { title, description, startDate, endDate, categoryCode } = req.body;

		// sanitization
		const cleanEventInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			startDate: new Date(startDate),
			endDate: new Date(endDate),
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

		const createdEvent = await eventService.createNewEvent(userId, cleanEventInfo);

		res.status(201).send({ code: 'CREATED_EVENT', result: createdEvent, success: true });

	} catch (error) {
		next(error);
	}
}

async function getUserEvents(req, res, next) {
	console.log('[getUserEvents] (controller)');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");

		const eventsList = await eventService.getUserEvents(userId);

		res.status(200).send({ code: 'OK', result: eventsList, success: true });
		
	} catch (error) {
		next(error);
	}
}

async function updateEventDates(req, res, next) {
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

		const updatedEvent = await eventService.updateEventDates(eventId, cleanDates);

		res.status(200).send({ code: 'UPDATED_EVENT_DATES', result: updatedEvent, success: true });

	} catch (error) {
		next(error);
	}
}

async function updateEvent(req, res, next) {
	console.log('[updateEvent] (controller)');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");

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
			res.status(200).send({ code: 'OK', result: null, success: true });
			return;
		}

		if (cleanEventInfo.title && !titleValidation(cleanEventInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanEventInfo.categoryCode && !categoryCodeValidation(userId, cleanEventInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		const updatedEvent = await eventService.updateEventInfo(eventId, cleanEventInfo);

		res.status(200).send({ code: 'UPDATED_EVENT', result: updatedEvent, success: true });

	} catch (error) {
		next(error);
	}
}

async function deleteEvent(req, res, next) {
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

		res.status(200).send({ code: 'DELETED_EVENT', result: null, success: true });
	} catch (error) {
		next(error);
	}
}


// TODO: LIST EVENT DETAILS

module.exports = {
	createNewEvent,
	getUserEvents,
	updateEventDates,
	updateEvent,
	deleteEvent
}