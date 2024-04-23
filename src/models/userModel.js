const { db } = require('../firebaseConfig');

const usersCollectionRef = db.collection('users');

async function createDbUser(user) {
	console.log('[createDbUser] (model)');

	const userRef = await usersCollectionRef.add(user);
	const createdUserId = userRef.id;

	return createdUserId;
}

async function getAllDbUsers() {
	console.log('[getAllDbUsers] (model)');

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

async function findUserByEmail(email) {
	console.log('[findUserByEmail] (model)');

	const snapshot = await usersCollectionRef.where('email', '==', email).get();
	const matchList = [];

	if (snapshot.empty) {
		console.log('No email matches found');
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

async function findUserById(userId) {
	console.log('[findUserById] (model)');

	const userRef = usersCollectionRef.doc(userId);
	const match = await userRef.get();
	if (!match.exists) {
		return false;
	}

	return true
}

async function updateDbUser(userId, updatedInfo) {
	console.log('[updateUser] (model)');
	const userRef = usersCollectionRef.doc(userId);
	await userRef.update(updatedInfo);
}

module.exports = {
	createDbUser,
	getAllDbUsers,
	findUserByEmail,
	findUserById,
	updateDbUser
};