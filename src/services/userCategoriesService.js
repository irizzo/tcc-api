const userCategoriesModel = require('../models/userCategoriesModel');

const defaultCategories = [
	{
		title: 'Trabalho',
		description: 'Tarefas relacionas a trabalho.',
		code: 'WORK',
	},
	{
		title: 'Acadêmico',
		description: 'Tarefas relacionadas a estudos, à escola ou faculdade.',
		code: 'ACADEMIC'
	},
	{
		title: 'Social',
		description: 'Tarefas relacionadas ao social, lazer etc',
		code: 'SOCIAL',
	}
]

async function createUserDefaultCategories(userId) {
	console.log('[createUserDefaultCategories] (service)');

	try {
		defaultCategories.forEach(async (category) => {
			await userCategoriesModel.createDbCategory(userId, category);
		})

	} catch (error) {
		throw error
	}
}

async function createNewCategory(userId, category) {
	try {
		return await userCategoriesModel.createDbCategory(userId, category);
	} catch (error) {
		throw error
	}
}

async function getAllUserCategories(userId) {
	try {
		return await userCategoriesModel.getAllDbCategories(userId);
	} catch (error) {
		throw error
	}
}

async function getCategoryByCode(userId, categoryCode) {
	try {
		return await userCategoriesModel.getCategoryByCode(userId, categoryCode);
	} catch (error) {
		throw error
	}
}

async function getCategoryById(userId, categoryId) {
	try {
		return await userCategoriesModel.findCategoryById(userId, categoryId);
	} catch (error) {
		throw error
	}
}

async function updateCategory(userId, categoryId, newInfo) {
	try {
		return await userCategoriesModel.updateCategory(userId, categoryId, newInfo);
	} catch (error) {
		throw error
	}
}

async function deleteCategory(userId, categoryId) {
	try {
		return await userCategoriesModel.deleteCategory(userId, categoryId);
	} catch (error) {
		throw error
	}
}

module.exports = {
	createUserDefaultCategories,
	createNewCategory,
	getAllUserCategories,
	getCategoryByCode,
	getCategoryById,
	updateCategory,
	deleteCategory
};