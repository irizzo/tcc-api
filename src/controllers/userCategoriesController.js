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
		res.status(201).send({ tokenCookieData, code: 'CREATED', result: createdCategoryId, success: true });

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
		res.status(200).send({ tokenCookieData, code: 'FOUND', result: categoriesList, success: true });

	} catch (error) {
		next(error);
	}
}

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
		res.status(200).send({ tokenCookieData, code: 'FOUND', result: foundCategoryInfo, success: true });

	} catch (error) {
		next(error);
	};
};

async function updateCategory(req, res, next) {
	console.log('[updateCategory] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const { categoryId } = req.params;

		if (!categoryId) {
			throw CustomError('INVALID_CATEGORY_ID', 400);
		}

		const foundCategoryInfo = await userCategoriesService.getCategoryById(userId, categoryId)
		if (foundCategoryInfo.length === 0) {
			throw CustomError('CATEGORY_NOT_FOUND', 404);
		}

		const { title, description } = req.body;

		const cleanCategoryInfo = { };

		if (title !== null) cleanCategoryInfo.title = generalSanitization(title);
		if (description !== null) cleanCategoryInfo.description = generalSanitization(description);

		console.log('[updateCategory] (controller) cleanCategoryInfo: ', cleanCategoryInfo);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		// check if there's any info to update
		if (!cleanCategoryInfo.title && !cleanCategoryInfo.description) {
			console.log('[updateCategory] (controller) nada pra atualizar');
			res.status(200).send({ tokenCookieData, code: 'OK', result: null, success: true });
			return;
		}

		// validation
		if (cleanCategoryInfo.title && !titleValidation(cleanCategoryInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		};

		await userCategoriesService.updateCategory(userId, categoryId, cleanCategoryInfo);

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'UPDATED', success: true });

	} catch (error) {
		next(error);
	}
}

async function deleteCategory(req, res, next) {
	console.log('[deleteCategory] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const { categoryId } = req.params;

		console.log('[deleteCategory] (controller) userId: ', userId);
		console.log('[deleteCategory] (controller) categoryId: ', categoryId);


		if (!categoryId) {
			throw CustomError('CATEGORY_CODE_NOT_FOUND', 400);
		}

		const foundCategoryInfo = await userCategoriesService.getCategoryById(userId, categoryId);
		if (foundCategoryInfo.length === 0) {
			throw CustomError('CATEGORY_NOT_FOUND', 404);
		}

		await userCategoriesService.deleteCategory(userId, categoryId);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'DELETED', result: null, success: true });

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
