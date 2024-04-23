const userModel = require('../models/userModel');
const userCategoriesService = require('../services/userCategoriesService');

const { titleValidation } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');
const generateIdentifierCode = require('../resources/generateIdentifier');

// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

async function createNewCategory(req, res) {
	console.log('[createNewCategory] (controller)');

	try {
		const { title, description } = req.body;
		
		// TODO: get userId from session

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if(!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		}

		const cleanCategoryInfo = {
			title: sanitizeString(title),
			description: sanitizeString(description),
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

		// TODO: check if categoryCode is valid!

		const createdCategoryRes = await userCategoriesService.createNewCategory(userId, cleanCategoryInfo);
		
		res.status(201).send({
			code: 'CREATED_CATEGORY',
			result: createdCategoryRes,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
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
		// TODO: user session

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		}

		// TODO: get directly from user (above)
		const categoriesList = await userCategoriesService.getAllUserCategories(userId);

		res.status(200).send({
			code: 'OK',
			result: categoriesList,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
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
		// TODO: get user session

		// validate userId
		const userExists = await userModel.findUserById(userId);
		
		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		} 
		
		const { categoryCode } = req.params;
		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		// TODO: get directly from user (above)
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
		// TODO: user session

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		} 

		const { categoryCode } = req.params;
		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		// TODO: get directly from user (above)
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

		let cleanCategoryInfo = {};

		if (title !== null) cleanTaskInfo.title = generalSanitization(title);
		if (description !== null) cleanTaskInfo.description = generalSanitization(description);

		const categoryId = foundCategoryInfo[0].id;

		const updatedCategory = await userCategoriesService.updateCategory(userId, categoryId, cleanCategoryInfo);

		res.status(200).send({
			code: 'UPDATED_CATEGORY',
			result: updatedCategory,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
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
		// TODO: get user session

		// validate userId
		const userExists = await userModel.findUserById(userId);
		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		} ;

		const { categoryCode } = req.params;
		const cleaCategoryCode = sanitizeCodeString(categoryCode);

		// TODO: get directly from user (above)
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