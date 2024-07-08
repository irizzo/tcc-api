const { db } = require('../firebaseConfig');

const eventsCollectionRef = db.collection('events');

async function createDbEvent(eventInfo) {
	console.log('[createDbEvent] (model)');

	const createEventRes = await eventsCollectionRef.add(eventInfo);
	const createdEventId = createEventRes.id;

	return createdEventId;
}

async function getUserEvents(userId) {
	console.log('[getUserEvents] (model)');

	const snapshot = await eventsCollectionRef.where('userId', '==', userId).get();
	const matchList = [];

	if (snapshot.empty) {
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

	const eventRef = eventsCollectionRef.doc(eventId);
	const match = await eventRef.get();

	if (!match.exists) { 
		return false;
	}

	return {
		id: match.id,
		...match.data()
	};
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