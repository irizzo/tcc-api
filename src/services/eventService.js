const eventModel = require('../models/eventModel');
const userModel = require('../models/userModel');

async function createNewEvent(userId, newEventInfo) {
	console.log('[createNewEvent] (service)');
	try {
		const eventInfo = { ...newEventInfo, createdAt: Date.now(), updatedAt: Date.now() };
		const createdEventId = await eventModel.createDbEvent(userId, eventInfo);
		await userModel.addEventRef(userId, createdEventId);

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
		return eventsList;
		
	} catch (error) {
		throw error;
	}
}

async function getUserEventById(eventId) {
	console.log('[getUserEventById] (service)');
	try {
		const match = await eventModel.findEventById(eventId);
		return match;

	} catch (error) {
		throw error;
	}
}

async function updateEventDates(eventId, newInfo) {
	console.log('[updateEventDates] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: Date.now() };
	  await eventModel.updateEvent(eventId, updatedInfo);
		return;

	} catch (error) {
		throw error;
	}
}

async function updateEventInfo(eventId, newInfo) {
	console.log('[updateEventInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: Date.now() };
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