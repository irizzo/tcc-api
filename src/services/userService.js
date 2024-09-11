const userModel = require('../models/userModel');

const { createUserDefaultCategories } = require('../services/userCategoriesService');
const { generateTokenCookieData } = require('../services/userAccessService');

exports.createNewUserService = async (newUserInfo) => {
	console.log('[createNewUser] (service)');
	try {
		const userInfo = {
			...newUserInfo,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
		}

		const createdUserId = await userModel.createDbUser(userInfo);

		await createUserDefaultCategories(createdUserId);
		return createdUserId;

	} catch (error) {
		throw error;
	}
}

exports.getUserByEmailService = async (email) => {
	console.log('[getUserByEmail] (service)');
	try {
		const userMatchList = await userModel.findUserByEmail(email);
		return userMatchList;
	} catch (error) {
		throw error;
	}
}

exports.getUserByIdService = async(userId) => {
	console.log('[getUserById] (service)');
	try {
		return await userModel.findUserById(userId);
	} catch (error) {
		throw error;
	}
}

exports.updateUserInfoService = async (userId, newInfo) => {
	console.log('[updateUserInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: new Date(Date.now())}
		await userModel.updateDbUser(userId, updatedInfo);
		return;
	} catch (error) {
		throw error;
	}
}

exports.loginService = async (userInfo) => {
	console.log('[login] (service)');
	try {
		const tokenCookieData = generateTokenCookieData({ userId: userInfo.id });
		return tokenCookieData;

	} catch (error) {
		throw error;
	}
}

exports.deleteUserService = async (userId) => {
	console.log('[deleteUserService]');

	try {
		return await userModel.deleteDbUser(userId);
		
	} catch (error) {
		throw error;
	}
}
