const userModel = require('../models/userModel');
const userCategoriesService = require('../services/userCategoriesService');
const userService = require('../services/userService');

const { titleValidation, categoryCodeExists } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');
const generateIdentifierCode = require('../resources/generateIdentifier');
const { handleAuth } = require('../resources/userAuth');

async function createNewCategory(req, res) {
	console.log('[createNewCategory] (controller)');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");

		const { title, description } = req.body;

		const cleanCategoryInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
		};

		// validation
		if (!titleValidation(cleanCategoryInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		};

		cleanCategoryInfo.code = generateIdentifierCode(cleanCategoryInfo.title);

		if (categoryCodeExists(userId, cleanCategoryInfo.code)) {
			throw CustomError('CATEGORY_ALREADY_EXISTS', 400);
		}

		const createdCategoryRes = await userCategoriesService.createNewCategory(userId, cleanCategoryInfo);

		res.status(201).send({ code: 'CREATED_CATEGORY', result: createdCategoryRes, success: true });

	} catch (error) {
		next(error);
	}
}

async function getAllCategories(req, res) {
	console.log('[getAllCategories] (controller)');

	try {
		const categoriesList = await userCategoriesService.getAllUserCategories(userId);

		res.status(200).send({ code: 'OK', result: categoriesList, success: true });

	} catch (error) {
		next(error);
	}
}

async function getCategoryByCode(req, res) {
	console.log('[getCategoryByCode] (controller)');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");
		const { categoryCode } = req.params;

		if (!categoryCode) {
			throw CustomError('CATEGORY_CODE_NOT_FOUND', 400);
		}

		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		if (! await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode)) { 
			throw CustomError('CATEGORY_NOT_FOUND', 404);
		}

		res.status(200).send({ code: 'FOUND_CATEGORY', result: foundCategoryInfo, success: true });

	} catch (error) {
		next(error);
	};
};

async function updateCategory(req, res) {
	console.log('[updateCategory] (controller)');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");
		const { categoryCode } = req.params;

		if (!categoryCode) {
			throw CustomError('CATEGORY_CODE_NOT_FOUND', 400);
		}

		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		const foundCategoryInfo = await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode);
		if (foundCategoryInfo.length === 0) {
			throw CustomError('CATEGORY_NOT_FOUND', 404);
		}

		const { title, description } = req.body;

		const cleanCategoryInfo = {
			title: title === null ? null : generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
		};

		// check if there's any info to update
		if (!cleanCategoryInfo.title && !cleanCategoryInfo.description) {
			res.status(200).send({ code: 'OK', result: null, success: true });
			return;
		}

		// validation
		if (cleanCategoryInfo.title && !titleValidation(cleanCategoryInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		};

		const categoryId = foundCategoryInfo[0].id;

		const updatedCategory = await userCategoriesService.updateCategory(userId, categoryId, cleanCategoryInfo);

		res.status(200).send({ code: 'UPDATED_CATEGORY', result: updatedCategory, success: true });

	} catch (error) {
		next(error);
	}
}

async function deleteCategory(req, res) {
	console.log('[deleteCategory] (controller)');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");
		const { categoryCode } = req.params;

		if (!categoryCode) {
			throw CustomError('CATEGORY_CODE_NOT_FOUND', 400);
		}

		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		const foundCategoryInfo = await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode);
		if (foundCategoryInfo.length === 0) {
			throw CustomError('CATEGORY_NOT_FOUND', 404);
		}

		const categoryId = foundCategoryInfo[0].id;
		await userCategoriesService.deleteCategory(userId, categoryId);

		res.status(200).send({ code: 'DELETED_CATEGORY', result: null, success: true });

	} catch (error) {
		next(error);
	}
}

module.exports = {
	createNewCategory,
	getAllCategories,
	getCategoryByCode,
	updateCategory,
	deleteCategory
};