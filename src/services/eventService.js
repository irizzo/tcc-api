const eventModel = require('../models/eventModel');
const { formatDatesInArray, convertStampToDate } = require('../resources/dates.helpers');

async function createNewEvent(userId, newEventInfo) {
	console.log('[createNewEvent] (service)');
	try {
		const eventInfo = {
			...newEventInfo,
			createdAt:  new Date(Date.now()), 
			updatedAt:  new Date(Date.now()),
			userId
		};

		const createdEventId = await eventModel.createDbEvent(eventInfo);
		return createdEventId;
	} catch (error) {
		console.log(`(service) error = ${error} `);
		throw error;
	}
}

async function getUserEvents(userId) {
	console.log('[getUserEvents] (service)');
	try {
		const eventsList = await eventModel.getUserEvents(userId);

		console.log('[getUserEventById] match: ', match);


		if (!eventsList || eventsList.length === 0) {
			console.log('eventList vazia');

			return [];
		}

		const formattedEventList = formatDatesInArray(eventsList);
		return formattedEventList;
		
	} catch (error) {
		throw error;
	}
}

async function getUserEventById(eventId) {
	console.log('[getUserEventById] (service)');
	try {
		const match = await eventModel.findEventById(eventId);

		console.log('[getUserEventById] match: ', match);

		if (!match) {
			return false
		}

		if (match.toDoDate) {
			console.log('[getUserEventById] match.toDoDate: ', match.toDoDate);
			match.toDoDate = convertStampToDate(match.toDoDate)
		}

		if (match.dueDate) {
			console.log('[getUserEventById] match.dueDate: ', match.dueDate);
			match.dueDate = convertStampToDate(match.dueDate)
		}

		return match;

	} catch (error) {
		throw error;
	}
}

async function updateEventDates(eventId, newInfo) {
	console.log('[updateEventDates] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt:  new Date(Date.now()) };
	  await eventModel.updateEvent(eventId, updatedInfo);
		return;

	} catch (error) {
		throw error;
	}
}

async function updateEventInfo(eventId, newInfo) {
	console.log('[updateEventInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt:  new Date(Date.now()) };
		await eventModel.updateEvent(eventId, updatedInfo);
		return;

	} catch (error) {
		throw error;
	}
}

async function deleteEvent(eventId) {
	console.log('[deleteEvent](service)');
	try {
		await eventModel.deleteEvent(eventId);
		return;
	} catch (error) {
		throw error;

	}
}

module.exports = {
	createNewEvent,
	getUserEvents,
	getUserEventById,
	updateEventDates,
	updateEventInfo,
	deleteEvent
}