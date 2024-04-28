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
		await userModel.updateDbUser(createdUserId, { jwt: generatedJwtToken});

		return { createdUserId, generatedJwtToken }

	} catch (error) {
		throw error;
	}
}

exports.getUserByEmail = async (email) => {
	console.log('[getUserByEmail] (service)');
	try {
		return await userModel.findUserByEmail(email);
	} catch (error) {
		throw error;
	}
}

exports.getUserById = async(userId) => {
	console.log('[getUserById] (service)');
	try {
		return await userModel.findUserById(userId);
	} catch (error) {
		throw error;
	}
}

exports.updateUserInfo = async (userId, newInfo) => {
	console.log('[updateUserInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: new Date(Date.now())}
		await userModel.updateDbUser(userId, updatedInfo);
		
	} catch (error) {
		throw error;
	}
}

exports.login = async (userInfo) => {
	console.log('[login] (service)');
	try {
		const generatedJwtToken = userAuth.generateTokenFromUserId(userInfo.id);
		await userModel.updateDbUser(userInfo.id, { jwt: generatedJwtToken });
		return generatedJwtToken;

	} catch (error) {
		throw error;
	}
}
