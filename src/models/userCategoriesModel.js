const { db } = require('../firebaseConfig');

const usersCollectionRef = db.collection('users');

const defaultCategories = [
	{
		title: "Trabalho",
		description: "Tarefas relacionas a trabalho.",
		code: "WORK",
	},
	{
		title: "Acadêmico",
		description: "Tarefas relacionadas a estudos, à escola ou faculdade.",
		code: "ACADEMIC"
	},
	{
		title: "Social",
		description: "Tarefas relacionadas ao social, lazer etc",
		code: "SOCIAL",
	}
]

async function createUserDefaultCategories(userId) {
	console.log(`[createUserDefaultCategories]`);

	console.log(`userId = ${userId}`);

	defaultCategories.forEach(async (cat) => {
		console.log(`categoryInfo = ${JSON.stringify(cat)}`);

		await usersCollectionRef.doc(userId).collection('categories').add(cat);
	})

	return;
}

async function createDbCategory(userId,category) {
	console.log('[/createDbCategory]');
	
	const categoryRef = await usersCollectionRef.doc(userId).collection('categories').add(category);
	const createdCategoryId = categoryRef.id;

	return createdCategoryId;
}

async function getAllDbCategories(userId) {
	console.log('[/getAllDbCategories]');

	const categoriesList = [];

	const snapshot = await usersCollectionRef.doc(userId).collection('categories').get();

	snapshot.forEach(doc => {
		categoriesList.push(doc.data());
	});

	return categoriesList;
}

async function getCategoryByCode(userId, categoryCode) {
	console.log('[/getCategoryByCode]');

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
	console.log('[/deleteCategory]');

	const categoryRef = usersCollectionRef.doc(userId).collection('categories').doc(categoryId);
	const deleteRes = await categoryRef.delete();

	console.log(`deleteRes = ${deleteRes}`);
	return deleteRes;
}

async function updateCategory(userId, categoryId, newInfo) {
	console.log('[/updateCategory]');

	const categoryRef = usersCollectionRef.doc(userId).collection('categories').doc(categoryId);
	const updateRes = await categoryRef.update(newInfo);
	return updateRes;
}

module.exports = {
	createUserDefaultCategories,
	createDbCategory,
	getAllDbCategories,
	getCategoryByCode,
	updateCategory,
	deleteCategory
};