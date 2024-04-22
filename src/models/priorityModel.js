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

	// the priority's code must be unique so there's only going to be 1 instance in the match list
	return matchList[0]; 
}

module.exports = {
	getAllDbPriorities,
	findPriorityByCode
}