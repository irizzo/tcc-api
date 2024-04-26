const userModel = require('../models/userModel'); // TODO: userService

const eventService = require('../services/eventService');

const { generalSanitization } = require('../resources/sanitization');
const { dueDateValidation, endDateValidation, titleValidation, categoryCodeExists } = require('../resources/validations');

// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

async function createNewEvent(req, res) {
	console.log('[createNewEvent] (controller)');

	try {
		const { title, description, startDate, endDate, categoryCode } = req.body;

		// TODO: get userId from session

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
			res.status(400).send({ code: 'INVALID_TITLE', result: null, success: false });
			return;
		}

		if (!dueDateValidation(cleanEventInfo.startDate)) {
			res.status(400).send({ code: 'INVALID_START_DATE', result: null, success: false });
			return;
		}

		if (!endDateValidation(cleanEventInfo.startDate, cleanEventInfo.endDate)) {
			res.status(400).send({ code: 'INVALID_END_DATE', result: null, success: false });
			return;
		}

		if (cleanEventInfo.categoryCode && !categoryCodeExists(userId, cleanEventInfo.categoryCode)) {
			res.category(400).send({ code: 'INVALID_CATEGORY_CODE', result: null, success: false });
			return;
		}

		const createdEvent = await eventService.createNewEvent(userId, cleanEventInfo);

		res.status(201).send({ code: 'CREATED_EVENT', result: createdEvent, success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

async function getUserEvents(req, res) {
	console.log('[getUserEvents] (controller)');

	try {
		// TODO: userSession

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		}

		const eventsList = await eventService.getUserEvents(userId);

		res.status(200).send({ code: 'OK', result: eventsList, success: true });
		
	} catch (error) {

		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

async function updateEventDates(req, res) {
	console.log('[updateEventDates] (controller)');
	try {
		// TODO: userSession

		const { eventId } = req.params;

		const foundEvent = await eventService.getUserEventById(eventId);
		if (!foundEvent) { 
			res.status(404).send({ code: 'EVENT_NOT_FOUND', result: null, success: false });
			return;
		}

		const { startDate, endDate } = req.body;

		const cleanDates = {
			startDate: new Date(startDate),
			endDate: new Date(endDate),
		}

		if (!dueDateValidation(cleanDates.startDate)) {
			res.status(400).send({ code: 'INVALID_START_DATE', result: null, success: false });
			return;
		}

		if (!endDateValidation(cleanDates.startDate, cleanDates.endDate)) {
			res.status(400).send({ code: 'INVALID_END_DATE', result: null, success: false });
			return;
		}

		const updatedEvent = await eventService.updateEventDates(eventId, cleanDates);

		res.status(200).send({ code: 'UPDATED_EVENT_DATES', result: updatedEvent, success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

async function updateEvent(req, res) {
	console.log('[updateEvent] (controller)');

	try {
		// TODO: userSession

		const { eventId } = req.params;

		const foundEvent = await eventService.getUserEventById(eventId);
		if (!foundEvent) {
			res.status(404).send({ code: 'EVENT_NOT_FOUND', result: null, success: false });
			return;
		}

		const { title, description, categoryCode } = req.body;

		const cleanEventInfo = {
			title: title === null ? null : generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			categoryCode: categoryCode === null ? null : generalSanitization(categoryCode)
		};

		// validations
		if (cleanEventInfo.title && !titleValidation(cleanEventInfo.title)) {
			res.status(400).send({ code: 'INVALID_TITLE', result: null, success: false });
			return;
		}

		if (cleanEventInfo.categoryCode && !categoryCodeValidation(userId, cleanEventInfo.categoryCode)) {
			res.category(400).send({
				code: 'INVALID_CATEGORY_CODE',
				result: null,
				success: false
			});
			return;
		}

		const updatedEvent = await eventService.updateEventInfo(eventId, cleanEventInfo);

		res.status(200).send({ code: 'UPDATED_EVENT', result: updatedEvent, success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

async function deleteEvent(req, res) {
	console.log('[deleteEvent] (controller)');
	try {
		// TODO: userSession

		const { eventId } = req.params;

		const foundEvent = await eventService.getUserEventById(eventId);
		if (!foundEvent) {
			res.status(404).send({ code: 'EVENT_NOT_FOUND', result: null, success: false });
			return;
		}

		await eventService.deleteEvent(eventId);

		res.status(200).send({ code: 'DELETED_EVENT', result: null, success: true });
	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

module.exports = {
	createNewEvent,
	getUserEvents,
	updateEventDates,
	updateEvent,
	deleteEvent
}