const { db } = require('../firebaseConfig');

const eventsCollectionRef = db.collection('events');

async function createDbEvent(event, userId) {
	console.log('[createDbEvent]');

	const createEventRes = await eventsCollectionRef.add({ ...event, userId });
	const createdEventId = createEventRes.id;

	return createdEventId;
}

// Recuperar eventos de um usuário
async function getUserEvents(userId) {
	console.log('[getUserEvents]');

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

module.exports = {
	createDbEvent,
	getUserEvents
}