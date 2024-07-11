const { db } = require('../firebaseConfig');

const usersCollectionRef = db.collection('users');

async function createDbCategory(userId, category) {
	
	const categoryRef = await usersCollectionRef.doc(userId).collection('categories').add(category);
	const createdCategoryId = categoryRef.id;

	return createdCategoryId;
}

async function getAllDbCategories(userId) {
	const categoriesList = [];

	const snapshot = await usersCollectionRef.doc(userId).collection('categories').get();

	snapshot.forEach(doc => {
		categoriesList.push({id: doc.id, ...doc.data()});
	});

	return categoriesList;
}

async function findCategoryById(userId, categoryId) {
	const categoryRef = usersCollectionRef.doc(userId).collection('categories').doc(categoryId);
	const match = await categoryRef.get();

	if (!match.exists) {
		return false;
	}

	return {
		id: match.id,
		...match.data()
	};
}


async function getCategoryByCode(userId, categoryCode) {
	const matchList = [];
	const snapshot = await usersCollectionRef.doc(userId).collection('categories').where('code', '==', categoryCode).get();

	if (snapshot.empty) {
		return [];
	}

	snapshot.forEach(doc => {
		matchList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return matchList[0];
}

async function deleteCategory(userId, categoryId) {
	const categoryRef = usersCollectionRef.doc(userId).collection('categories').doc(categoryId);
	await categoryRef.delete();
}

async function updateCategory(userId, categoryId, newInfo) {
	const categoryRef = usersCollectionRef.doc(userId).collection('categories').doc(categoryId);
	return await categoryRef.update(newInfo);
}

module.exports = {
	createDbCategory,
	getAllDbCategories,
	findCategoryById,
	getCategoryByCode,
	updateCategory,
	deleteCategory
};
