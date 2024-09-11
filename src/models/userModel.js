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
		console.log(`snapshot.empty`);
		return [];
	}

	snapshot.forEach(doc => {
		matchList.push({
			id: doc.id,
			...doc.data()
		});
	});

	console.log(`matchList not empty = ${JSON.stringify(matchList) }`);
	return matchList;
}

async function findUserById(userId) {
	console.log('[findUserById] (model)');

	const userRef = usersCollectionRef.doc(userId);
	const match = await userRef.get();
	if (!match.exists) {
		return false;
	}

	return {
		id: match.id,
		...match.data()
	};
}

async function updateDbUser(userId, updatedInfo) {
	console.log('[updateUser] (model)');
	const userRef = usersCollectionRef.doc(userId);
	await userRef.update(updatedInfo);
	return;
}

async function deleteDbUser(userId) {
	console.log('[deleteUser] (model)');
	const userRef = usersCollectionRef.doc(userId);
	const deleteRes = await userRef.delete();
	return deleteRes;
}

module.exports = {
	createDbUser,
	getAllDbUsers,
	findUserByEmail,
	findUserById,
	updateDbUser,
	deleteDbUser
};