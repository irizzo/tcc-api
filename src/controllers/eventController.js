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

		// TODO: get user session
		// validate user session
		// if user session is not valid, redirect to log in
		// if session is valid, get userId

		// sanitization
		const cleanEventInfo = {};

		cleanEventInfo.title = sanitizeString(title);
		cleanEventInfo.description = sanitizeString(description);
		cleanEventInfo.categoryCode = sanitizeCodeString(categoryCode);

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
		if(cleanEventInfo.categoryCode === "") {
			cleanEventInfo.categoryCode = null;

		} else if (!categoryCodeValidation(cleanEventInfo.categoryCode)) {
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
		// TODO: get user session
		// TODO: validate user session
		// TODO: if user session is not valid, redirect to log in
		// TODO: if session is valid, get userId
		// const { userId } = req.session;

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

module.exports = {
	createEvent,
	getAllEvents
}