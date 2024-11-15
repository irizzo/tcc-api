const eventModel = require('../models/eventModel');
const { formatEventDates, convertStampToDate } = require('../resources/dates.helpers');

async function createNewEvent(userId, newEventInfo) {
	console.log('[createNewEvent] (service)');
	try {
		const eventInfo = {
			...newEventInfo,
			createdAt:  new Date(), 
			updatedAt:  new Date(),
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

		if (!eventsList || eventsList.length === 0) {
			return [];
		}
		
		return formatEventDates(eventsList);

	} catch (error) {
		throw error;
	}
}

async function getUserEventById(eventId) {
	console.log('[getUserEventById] (service)');
	try {
		const match = await eventModel.findEventById(eventId);

		if (!match) {
			return false
		}

		if (match.startDate) {
			match.startDate = convertStampToDate(match.startDate)
		}

		if (match.endDate) {
			match.endDate = convertStampToDate(match.endDate)
		}

		return match;

	} catch (error) {
		throw error;
	}
}

async function updateEventInfo(eventId, newInfo) {
	console.log('[updateEventInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt:  new Date() };
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
	updateEventInfo,
	deleteEvent
}
