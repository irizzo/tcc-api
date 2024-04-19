const userCategoriesModel = require('../models/userCategoriesModel');
const userModel = require('../models/userModel');

const { titleValidation } = require('../resources/validations');
const { sanitizeString } = require('../resources/sanitization');
const generateIdentifierCode = require('../resources/generateIdentifier');

const userId = "stQM4UlD6n6c6h9Lmi7w";

async function createCategory(req, res) {
	console.log('[createCategory] (controller)');

	try {
		const { title } = req.body;
		
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

		cleanCategory.title = sanitizeString(title);

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
		console.log(`ERROR: ${error}`);
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
		console.log(`ERROR: ${error}`);
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
		console.log(`ERROR: ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	};
};

module.exports = {
	createCategory,
	getAllCategories,
	getCategoryByCode
};