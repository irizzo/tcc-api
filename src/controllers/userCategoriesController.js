const userCategoriesService = require('../services/userCategoriesService');
const userAccessService = require('../services/userAccessService');

const CustomError = require('../resources/error');
const { titleValidation, categoryCodeExists } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');
const generateIdentifierCode = require('../resources/generateIdentifier');
const { extractDataFromToken } = require('../resources/userAuth');

async function createNewCategory(req, res, next) {
	console.log('[createNewCategory] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");

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

		if (await categoryCodeExists(userId, cleanCategoryInfo.code)) {
			throw CustomError('CATEGORY_ALREADY_EXISTS', 400);
		}

		const createdCategoryId = await userCategoriesService.createNewCategory(userId, cleanCategoryInfo);
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(201).send({ tokenCookieData: tokenCookieData, code: 'CREATED', result: createdCategoryId, success: true });

	} catch (error) {
		next(error);
	}
}

async function getAllCategories(req, res, next) {
	console.log('[getAllCategories] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const categoriesList = await userCategoriesService.getAllUserCategories(userId);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'FOUND', result: categoriesList, success: true });

	} catch (error) {
		next(error);
	}
}

// TODO: change from 'code' to 'id'
async function getCategoryByCode(req, res, next) {
	console.log('[getCategoryByCode] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const { categoryCode } = req.params;

		if (!categoryCode) {
			throw CustomError('CATEGORY_CODE_NOT_FOUND', 400);
		}

		const cleaCategoryCode = generalSanitization(categoryCode);

		const foundCategoryInfo = await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode)
		if (!foundCategoryInfo) {
			throw CustomError('CATEGORY_NOT_FOUND', 404);
		}

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'FOUND', result: foundCategoryInfo, success: true });

	} catch (error) {
		next(error);
	};
};

// TODO: REVIEW SERVICE
async function updateCategory(req, res, next) {
	console.log('[updateCategory] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const { categoryCode } = req.params;

		if (!categoryCode) {
			throw CustomError('CATEGORY_CODE_NOT_FOUND', 400);
		}

		const cleaCategoryCode = generalSanitization(categoryCode);

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
			res.status(200).send({ tokenCookieData: tokenCookieData, code: 'OK', result: null, success: true });
			return;
		}

		// validation
		if (cleanCategoryInfo.title && !titleValidation(cleanCategoryInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		};

		await userCategoriesService.updateCategory(userId, foundCategoryInfo.id, cleanCategoryInfo);
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);

		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'UPDATED', success: true });

	} catch (error) {
		next(error);
	}
}

// TODO: change from 'category code' to 'category id'
async function deleteCategory(req, res, next) {
	console.log('[deleteCategory] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const { categoryCode } = req.params;

		if (!categoryCode) {
			throw CustomError('CATEGORY_CODE_NOT_FOUND', 400);
		}

		const cleaCategoryCode = generalSanitization(categoryCode);

		const foundCategoryInfo = await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode);
		if (foundCategoryInfo.length === 0) {
			throw CustomError('CATEGORY_NOT_FOUND', 404);
		}

		await userCategoriesService.deleteCategory(userId, foundCategoryInfo.id);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'DELETED', result: null, success: true });

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
