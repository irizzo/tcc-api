const { db } = require('../firebaseConfig');

const usersCollectionRef = db.collection('users');

async function createDbUser(user) {
	console.log('[createDbUser]');

	const userRef = await usersCollectionRef.add(user);
	const createdUserId = userRef.id;

	return createdUserId;
}

async function getAllDbUsers() {
	console.log('[getAllDbUsers]');

	const usersList = [];

	const snapshot = await usersCollectionRef.get();

	snapshot.forEach(doc => {
		usersList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return usersList;
}

async function getUserByEmail(email) {
	console.log('[getUserByEmail]');

	const snapshot = await usersCollectionRef.where('email', '==', email).get();
	const matchList = [];

	if (snapshot.empty) {
		console.log('No email matches found');
		return matchList;
	}

	snapshot.forEach(doc => {
		matchList.push(doc.id);
	});

	return matchList;
}

module.exports = {
	createDbUser,
	getAllDbUsers,
	getUserByEmail
};