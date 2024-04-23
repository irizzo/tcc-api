const userModel = require('../models/userModel');
const { createUserDefaultCategories } = require('../services/userCategoriesService');

const userAuth = require('../resources/userAuth');

exports.createNewUser = async (newUserInfo) => {
	console.log('[createNewUser] (service)');
	try {
		const userInfo = {
			...newUserInfo,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
		}

		const createdUserId = await userModel.createDbUser(userInfo);
		const generatedJwtToken = userAuth.generateTokenFromUserId(createdUserId);
		await createUserDefaultCategories(createdUserId);

		return { createdUserId, generatedJwtToken }

	} catch (error) {
		throw error;
	}
}

exports.getUserByEmail = async (email) => {
	try {
		return await userModel.findUserByEmail(email);
	} catch (error) {
		throw error;
	}
}
