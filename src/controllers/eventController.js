const eventModel = require('../models/eventModel');
const userModel = require('../models/userModel');

const { sanitizeString, sanitizeCodeString } = require('../resources/sanitization');
const { dueDateValidation, endDateValidation, titleValidation, categoryCodeValidation } = require('../resources/validations');


// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

async function createEvent(req, res) {
	console.log('[createEvent] (controller)');
	try {
		const { title, description, startDate, endDate, categoryCode } = req.body;

		// TODO: userSession

		// sanitization
		const cleanEventInfo = {};

		cleanEventInfo.title = sanitizeString(title);
		cleanEventInfo.description = sanitizeString(description);

		if (categoryCode !== null) {
			cleanEventInfo.categoryCode = sanitizeCodeString(categoryCode);
		} else {
			cleanEventInfo.categoryCode = null;
		}

		cleanEventInfo.startDate = new Date(startDate);
		cleanEventInfo.endDate = new Date(endDate);

		// validation
		if (!titleValidation(cleanEventInfo.title)) {
			res.status(400).send({
				code: 'INVALID_TITLE',
				result: null,
				success: false
			});

			return;
		}

		if (!dueDateValidation(cleanEventInfo.startDate)) {
			res.status(400).send({
				code: 'INVALID_START_DATE',
				result: null,
				success: false
			});

			return;
		}

		if (!endDateValidation(cleanEventInfo.startDate, cleanEventInfo.endDate)) {
			res.status(400).send({
				code: 'INVALID_END_DATE',
				result: null,
				success: false
			});

			return;
		}

		// TODO: Category validation
		if (!categoryCodeValidation(cleanEventInfo.categoryCode)) {
			res.category(400).send({
				code: 'INVALID_CATEGORY_CODE',
				result: null,
				success: false
			});

			return;
		}

		// create event (DB)
		const createdEvent = await eventModel.createDbEvent(cleanEventInfo, userId);
		console.log(`createdEvent = ${JSON.stringify(createdEvent)}`);

		res.status(201).send({
			code: 'CREATED_EVENT',
			result: createdEvent,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function getAllEvents(req, res) {
	console.log('[getAllEvents] (controller)');

	try {
		// TODO: userSession

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if (!userExists) {
			console.log(`invalid user ID`);
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		}

		const eventsList = await eventModel.getUserEvents(userId);

		res.status(200).send({
			code: 'OK',
			result: eventsList,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

// TODO: search events that have corresponding titles
async function getEventByTitle(req, res) {
	console.log('[getEventByTitle] (controller)');

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
		} else console.log('found user');

		const { eventTitle } = req.params;

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function updateEventDates(req, res) {
	console.log('[updateEventDates] (controller)');
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
		} else console.log('found user');

		const { eventId } = req.params;

		const foundEvent = await eventModel.findEventById(eventId);
		if (!foundEvent) {
			res.status(404).send({
				code: 'EVENT_NOT_FOUND',
				result: null,
				success: false
			});

			return;
		}

		const { startDate, endDate } = req.body;

		const cleanDates = {}
		cleanDates.startDate = new Date(startDate);
		cleanDates.endDate = new Date(endDate);

		if (!dueDateValidation(cleanDates.startDate)) {
			res.status(400).send({
				code: 'INVALID_START_DATE',
				result: null,
				success: false
			});

			return;
		}

		if (!endDateValidation(cleanDates.startDate, cleanDates.endDate)) {
			res.status(400).send({
				code: 'INVALID_END_DATE',
				result: null,
				success: false
			});

			return;
		}

		// update event (DB)
		const updatedEvent = await eventModel.updateEvent(eventId, cleanDates);

		res.status(200).send({
			code: 'UPDATED_EVENT_DATES',
			result: updatedEvent,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function updateEvent(req, res) {
	console.log('[updateEvent] (controller)');

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
		} else console.log('found user');

		const { eventId } = req.params;

		const foundEvent = await eventModel.findEventById(eventId);
		if(!foundEvent) {
			res.status(404).send({
				code: 'EVENT_NOT_FOUND',
				result: null,
				success: false
			});

			return;
		}

		// sanitization
		const cleanEventInfo = {};
		const { title, description, categoryCode } = req.body;

		if (title !== null) {
			cleanEventInfo.title = sanitizeString(title);
		}

		if (description !== null) {
			cleanEventInfo.description = sanitizeString(description);
		}

		if (categoryCode !== null) {
			cleanEventInfo.categoryCode = sanitizeCodeString(categoryCode);
		}

		// validation 
		if(!cleanEventInfo.title) {

		} else if (!titleValidation(cleanEventInfo.title)) {
				res.status(400).send({
					code: 'INVALID_TITLE',
					result: null,
					success: false
				});

				return;
		}	

		if (!cleanEventInfo.categoryCode) {

		} else if (!categoryCodeValidation(cleanEventInfo.categoryCode)) {
			// TODO: Category validation
			res.category(400).send({
				code: 'INVALID_CATEGORY_CODE',
				result: null,
				success: false
			});

			return;
		}

		// update event (DB)
		const updatedEvent = await eventModel.updateEvent(eventId, cleanEventInfo);

		res.status(200).send({
			code: 'UPDATED_EVENT',
			result: updatedEvent,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function deleteEvent(req, res) {
	console.log('[deleteEvent] (controller)');
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
		} else console.log('found user');

		const { eventId } = req.params;

		const foundEvent = await eventModel.findEventById(eventId);

		if (!foundEvent) {
			res.status(404).send({
				code: 'EVENT_NOT_FOUND',
				result: null,
				success: false
			});

			return;
		}

		// delete on db
		const deletedEvent = await eventModel.deleteEvent(eventId);
		console.log(`deletedEvent = ${deletedEvent}`);

		res.status(200).send({
			code: 'DELETED_EVENT',
			result: null,
			success: true
		});
	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

module.exports = {
	createEvent,
	getAllEvents,
	updateEventDates,
	updateEvent,
	deleteEvent
}