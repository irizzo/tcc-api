const { db } = require('../firebaseConfig');

const usersCollectionRef = db.collection('users');

async function createDbCategory(userId, category) {
	console.log('[createDbCategory] (model)');
	
	const categoryRef = await usersCollectionRef.doc(userId).collection('categories').add(category);
	const createdCategoryId = categoryRef.id;

	return createdCategoryId;
}

async function getAllDbCategories(userId) {
	console.log('[getAllDbCategories] (model)');

	const categoriesList = [];

	const snapshot = await usersCollectionRef.doc(userId).collection('categories').get();

	snapshot.forEach(doc => {
		categoriesList.push(doc.data());
	});

	return categoriesList;
}

async function getCategoryByCode(userId, categoryCode) {
	console.log('[getCategoryByCode] (model)');

	const matchList = [];
	const snapshot = await usersCollectionRef.doc(userId).collection('categories').where('code', '==', categoryCode).get();

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

async function deleteCategory(userId, categoryId) {
	console.log('[deleteCategory] (model)');

	const categoryRef = usersCollectionRef.doc(userId).collection('categories').doc(categoryId);
	const deleteRes = await categoryRef.delete();

	console.log(`deleteRes = ${deleteRes}`);
	return deleteRes;
}

async function updateCategory(userId, categoryId, newInfo) {
	console.log('[updateCategory] (model)');

	const categoryRef = usersCollectionRef.doc(userId).collection('categories').doc(categoryId);
	const updateRes = await categoryRef.update(newInfo);
	return updateRes;
}

module.exports = {
	createDbCategory,
	getAllDbCategories,
	getCategoryByCode,
	updateCategory,
	deleteCategory
};