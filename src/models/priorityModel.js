const { db } = require('../firebaseConfig');

const prioritiesCollectionRef = db.collection('priorities');

async function getAllDbPriorities() {
	console.log('[getAllDbPriorities] (model)');

	const prioritiesList = [];

	const snapshot = await prioritiesCollectionRef.get();

	snapshot.forEach(doc => {
		prioritiesList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return prioritiesList;
}

async function findPriorityByCode(code) {
	console.log('[findPriorityByCode] (model)');

	const snapshot = await prioritiesCollectionRef.where('code', '==', code).get();
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
	getAllDbPriorities,
	findPriorityByCode
}