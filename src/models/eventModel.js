const { db } = require('../firebaseConfig');

const eventsCollectionRef = db.collection('events');

async function createDbEvent(userId, eventInfo) {
	console.log('[createDbEvent] (model)');

	const createEventRes = await eventsCollectionRef.add({ ...eventInfo, userId });
	const createdEventId = createEventRes.id;

	return createdEventId;
}

async function getUserEvents(userId) {
	console.log('[getUserEvents] (model)');

	const snapshot = await eventsCollectionRef.where('userId', '==', userId).get();
	const matchList = [];

	if (snapshot.empty) {
		console.log('No events found');
		return [];
	}

	snapshot.forEach(doc => {
		matchList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return matchList;
}

async function findEventById(eventId) {
	console.log('[findEventById] (model)');

	const userRef = eventsCollectionRef.doc(eventId);
	const match = await userRef.get();

	if (!match.exists) { 
		return false;
	}

	return match; 
}

async function updateEvent(eventId, newInfo) {
	console.log('[updateEvent] (model)');
	const eventRef = eventsCollectionRef.doc(eventId);
	const updateRes = await eventRef.update(newInfo);
	return updateRes;
}

async function deleteEvent(eventId) {
	console.log('[deleteEvent] (model)');
	const eventRef = eventsCollectionRef.doc(eventId);
	const deleteRes = await eventRef.delete();
	return deleteRes;
}

module.exports = {
	createDbEvent,
	getUserEvents,
	findEventById,
	updateEvent,
	deleteEvent
}