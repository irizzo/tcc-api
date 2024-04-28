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
		const { authorization } = req.headers;

		const authRes = handleAuth(authorization);
		if (!authRes) {
			res.status(401).send({ code: 'NOT_AUTHORIZED', success: false });
			return;
		}

		const userId = authRes.userId;

		if (! await userService.getUserById(userId)) {
			res.status(404).send({ code: 'USER_NOT_FOUND', success: false });
			return;
		}

		const { title, description } = req.body;

		const cleanCategoryInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
		};

		// validation
		if (!titleValidation(cleanCategoryInfo.title)) {
			res.status(400).send({
				code: 'INVALID_TITLE',
				result: null,
				success: false
			});

			return;
		};
		
		cleanCategoryInfo.code = generateIdentifierCode(cleanCategoryInfo.title);

		if (categoryCodeExists(userId, cleanCategoryInfo.code)) {
			res.status(400).send({ code: 'CATEGORY_ALREADY_EXISTS', result: null, success: false});
		}

		const createdCategoryRes = await userCategoriesService.createNewCategory(userId, cleanCategoryInfo);
		
		res.status(201).send({
			code: 'CREATED_CATEGORY',
			result: createdCategoryRes,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		console.log(`ERROR = ${error}`);
		console.log(`ERROR = ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function getAllCategories(req, res) {
	console.log('[getAllCategories] (controller)');

	try {
		const { authorization } = req.headers;

		const authRes = handleAuth(authorization);
		if (!authRes) {
			res.status(401).send({ code: 'NOT_AUTHORIZED', success: false });
			return;
		}

		const userId = authRes.userId;

		if (! await userService.getUserById(userId)) {
			res.status(404).send({ code: 'USER_NOT_FOUND', success: false });
			return;
		}

		const categoriesList = await userCategoriesService.getAllUserCategories(userId);

		res.status(200).send({
			code: 'OK',
			result: categoriesList,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		console.log(`ERROR = ${error}`);
		console.log(`ERROR = ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function getCategoryByCode(req, res) {
	console.log('[getCategoryByCode] (controller)');

	try {
		const { authorization } = req.headers;

		const authRes = handleAuth(authorization);
		if (!authRes) {
			res.status(401).send({ code: 'NOT_AUTHORIZED', success: false });
			return;
		}

		const userId = authRes.userId;

		if (! await userService.getUserById(userId)) {
			res.status(404).send({ code: 'USER_NOT_FOUND', success: false });
			return;
		}
		
		const { categoryCode } = req.params;
		
		if (!categoryCode) {
			res.status(404).send({ code: 'CATEGORY_CODE_NOT_FOUND', result: null, success: false });
			return;
		}

		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		const foundCategoryInfo = await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode);
		if (!foundCategoryInfo) {
			res.status(404).send({
				code: 'CATEGORY_NOT_FOUND',
				result: null,
				success: false
			});

			return;
		}

		res.status(200).send({
			code: 'FOUND_CATEGORY',
			result: foundCategoryInfo,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		console.log(`ERROR = ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	};
};

async function updateCategory(req, res) {
	console.log('[updateCategory] (controller)');

	try {
		const { authorization } = req.headers;

		const authRes = handleAuth(authorization);
		if (!authRes) {
			res.status(401).send({ code: 'NOT_AUTHORIZED', success: false });
			return;
		}

		const userId = authRes.userId;

		if (! await userService.getUserById(userId)) {
			res.status(404).send({ code: 'USER_NOT_FOUND', success: false });
			return;
		}

		const { categoryCode } = req.params;
		
		if (!categoryCode) {
			res.status(404).send({ code: 'CATEGORY_CODE_NOT_FOUND', result: null, success: false });
			return;
		}

		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		const foundCategoryInfo = await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode);
		if (foundCategoryInfo.length === 0) {
			res.status(404).send({
				code: 'CATEGORY_NOT_FOUND',
				result: null,
				success: false
			});

			return;
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
			res.status(400).send({
				code: 'INVALID_TITLE',
				result: null,
				success: false
			});

			return;
		};

		const categoryId = foundCategoryInfo[0].id;

		const updatedCategory = await userCategoriesService.updateCategory(userId, categoryId, cleanCategoryInfo);

		res.status(200).send({
			code: 'UPDATED_CATEGORY',
			result: updatedCategory,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		console.log(`ERROR = ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function deleteCategory(req, res) {
	console.log('[deleteCategory] (controller)');

	try {
		const { authorization } = req.headers;

		const authRes = handleAuth(authorization);
		if (!authRes) {
			res.status(401).send({ code: 'NOT_AUTHORIZED', success: false });
			return;
		}

		const userId = authRes.userId;

		if (! await userService.getUserById(userId)) {
			res.status(404).send({ code: 'USER_NOT_FOUND', success: false });
			return;
		}
		const { categoryCode } = req.params;
		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		const foundCategoryInfo = await userCategoriesService.getCategoryByCode(userId, cleaCategoryCode);
		if (foundCategoryInfo.length === 0) {
			res.status(404).send({
				code: 'CATEGORY_NOT_FOUND',
				result: null,
				success: false
			});

			return;
		}

		const categoryId = foundCategoryInfo[0].id;
		await userCategoriesService.deleteCategory(userId, categoryId);

		res.status(200).send({
			code: 'DELETED_CATEGORY',
			result: null,
			success: true
		});
		
	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		console.log(`ERROR = ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

module.exports = {
	createNewCategory,
	getAllCategories,
	getCategoryByCode,
	updateCategory,
	deleteCategory
};