const userService = require('../services/userService');
const userAccessService = require('../services/userAccessService')

// resources
const CustomError = require('../resources/error');
const { generalSanitization } = require('../resources/sanitization');
const { emailValidation, passwordValidation } = require('../resources/validations');
const { extractDataFromToken } = require('../resources/userAuth');
const { isObjectEmpty } = require('../resources/utils');

exports.getUserInfo = async (req, res, next) => {
	console.log('[getUserInfo] (controller)');
	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');

		const userFound = await userService.getUserByIdService(userId);
		
		console.log('[getUserInfo] userFound: ', userFound);

		if (!userFound) {
			throw new CustomError('NOT_FOUND', 404);
		}

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, result: userFound, code: 'FOUND', success: true });

	} catch (error) {
		next(error)
	}
}

exports.updateUser = async (req, res, next) => {
	console.log('[updateUser] (controller)');
	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		const { firstName, lastName, email, password } = req.body;

		const cleanUserInfo = {};

		if (firstName !== null) cleanUserInfo.firstName = generalSanitization(firstName);
		if (lastName !== null) cleanUserInfo.lastName = generalSanitization(lastName);
		if (email !== null) cleanUserInfo.email = generalSanitization(email);
		if (password !== null) cleanUserInfo.password = generalSanitization(password);


		if (isObjectEmpty(cleanUserInfo)) {
			console.log('nothing to change');
			res.status(200).send({ tokenCookieData, code: 'OK', success: true });
			return;
		}

		if (cleanUserInfo.password && !passwordValidation(cleanUserInfo.password)) {
			throw CustomError('INVALID_PASSWORD', 400);
		}

		if (cleanUserInfo.email && !emailValidation(cleanUserInfo.email)) {
			throw CustomError('INVALID_EMAIL', 400);
		}

		await userService.updateUserInfoService(userId, cleanUserInfo);

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'UPDATED', success: true });
	} catch (error) {
		next(error)
	}
}

exports.deleteUser = async (req, res, next) => {
	console.log('[deleteUser] (controller)');
	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		const userFound = await userService.getUserByIdService(userId);

		if (!userFound) {
			throw CustomError('USER_NOT_FOUND', 400);
		}

		await userService.deleteUserService(userId);

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ code: 'DELETED', success: true });

	} catch (error) {
		next(error)
	}
}