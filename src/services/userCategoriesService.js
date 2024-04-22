const userCategoriesModel = require('../models/userCategoriesModel');

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
	console.log('[createUserDefaultCategories] (service)');

	try {
		defaultCategories.forEach(async (category) => {
			await userCategoriesModel.createDbCategory(userId, category)
		})
	} catch (error) {
		throw error
	}
}

async function createNewCategory(userId, category) {
	try {
		const createdCategory = await userCategoriesModel.createDbCategory(userId, category);
		return createdCategory;
	} catch (error) {
		throw error
	}
}

async function getAllUserCategories(userId) {
	try {

	} catch (error) {
		throw error
	}
}

async function getCategoryByCode(categoryCode) {
	try {

	} catch (error) {
		throw error
	}
}

async function updateCategory(userId, categoryCode, newInfo) {
	try {

	} catch (error) {
		throw error
	}
}

async function deleteCategory(userId, categoryCode) {
	try {

	} catch (error) {
		throw error
	}
}

module.exports = {
	createUserDefaultCategories,
	createNewCategory,
	getAllUserCategories,
	getCategoryByCode,
	updateCategory,
	deleteCategory
};