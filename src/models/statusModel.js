const { db } = require('../firebaseConfig');

const statusCollectionRef = db.collection('status');

async function getAllDbStatus() {
	console.log(`[getAllDbStatus]`);

	const statusList = [];

	const snapshot = await statusCollectionRef.get();

	snapshot.forEach(doc => {
		statusList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return statusList;
}

async function findStatusByCode(code) {
	console.log('[findStatusByCode]');

	const snapshot = await statusCollectionRef.where('code', '==', code).get();
	const matchList = [];

	if (snapshot.empty) {
		console.log('No matches found');
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
	getAllDbStatus,
	findStatusByCode
}