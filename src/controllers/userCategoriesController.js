const userCategoriesModel = require('../models/userCategoriesModel');
const userModel = require('../models/userModel');

const { titleValidation } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');
const generateIdentifierCode = require('../resources/generateIdentifier');

// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

async function createCategory(req, res) {
	console.log('[createCategory] (controller)');

	try {
		const { title, description } = req.body;
		
		// TODO: get user session
		// TODO: validate user session
		// TODO: if user session is not valid, redirect to log in
		// TODO: if session is valid, get userId
		// const { userId } = req.session;

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if(!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		}

		let cleanCategory = { };

		cleanCategory.title = generalSanitization(title);
		cleanCategory.description = generalSanitization(description);

		// validation
		if (!titleValidation(cleanCategory.title)) {
			res.status(400).send({
				code: 'INVALID_TITLE',
				result: null,
				success: false
			});

			return;
		};
		
		cleanCategory.code = generateIdentifierCode(cleanCategory.title);

		// create on DB
		const createdCategoryRes = await userCategoriesModel.createDbCategory(userId, cleanCategory);

		console.log(`cleanCategory = ${JSON.stringify(cleanCategory)}`);
		
		res.status(201).send({
			code: 'CREATED_CATEGORY',
			result: createdCategoryRes,
			success: true
		});

	} catch (error) {
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
		// TODO: get user session
		// TODO: validate user session
		// TODO: if user session is not valid, redirect to log in
		// TODO: if session is valid, get userId
		// const { userId } = req.session;

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		}

		const categoriesList = await userCategoriesModel.getAllDbCategories(userId);

		res.status(200).send({
			code: 'OK',
			result: categoriesList,
			success: true
		});

	} catch (error) {
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
		// TODO: validate user session
		// TODO: if user session is not valid, redirect to log in
		// TODO: if session is valid, get userId
		// const { userId } = req.session;
		
		// validate userId
		const userExists = await userModel.findUserById(userId);
		
		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		} else console.log('found user')
		
		const { categoryCode } = req.params;

		const foundCategoryInfo = await userCategoriesModel.getCategoryByCode(userId, categoryCode);

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
		// TODO: get user session
		// TODO: validate user session
		// TODO: if user session is not valid, redirect to log in
		// TODO: if session is valid, get userId
		// const { userId } = req.session;

		// validate userId
		const userExists = await userModel.findUserById(userId);

		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		} else console.log('found user')

		const { categoryCode } = req.params;

		const foundCategoryInfo = await userCategoriesModel.getCategoryByCode(userId, categoryCode);

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

		if(title.length > 0) {
			cleanCategoryInfo.title = generalSanitization(title);
		}

		if(description.length > 0) {
			cleanCategoryInfo.description = generalSanitization(description);
		}

		console.log(`cleanCategoryInfo = ${JSON.stringify(cleanCategoryInfo)}`);

		const categoryId = foundCategoryInfo[0].id;

		// update on DB
		const updatedCategory = await userCategoriesModel.updateCategory(userId, categoryId, cleanCategoryInfo)

		res.status(200).send({
			code: 'UPDATED_CATEGORY',
			result: updatedCategory,
			success: true
		});

	} catch (error) {
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function deleteCategory(req, res) {
	console.log('[updateCategory] (controller)');

	try {
		// TODO: get user session
		// TODO: validate user session
		// TODO: if user session is not valid, redirect to log in
		// TODO: if session is valid, get userId
		// const { userId } = req.session;

		// validate userId
		const userExists = await userModel.findUserById(userId);
		if (!userExists) {
			res.status(400).send({
				code: 'INVALID_USER_ID',
				result: null,
				success: false
			})
		} else console.log('found user');

		const { categoryCode } = req.params;

		const foundCategoryInfo = await userCategoriesModel.getCategoryByCode(userId, categoryCode);

		if (foundCategoryInfo.length === 0) {
			res.status(404).send({
				code: 'CATEGORY_NOT_FOUND',
				result: null,
				success: false
			});

			return;
		}

		const categoryId = foundCategoryInfo[0].id;

		// delete on db
		const deletedCategory = await userCategoriesModel.deleteCategory(userId, categoryId);
		console.log(`deletedCategory = ${deletedCategory}`);

		res.status(200).send({
			code: 'DELETED_CATEGORY',
			result: null,
			success: true
		});
		
	} catch (error) {
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

module.exports = {
	createCategory,
	getAllCategories,
	getCategoryByCode,
	updateCategory,
	deleteCategory
};