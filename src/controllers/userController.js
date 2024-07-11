const userService = require('../services/userService');

// resources
const { encryptPlainPass, comparePlainAndHash } = require('../resources/encrypt');
const { generalSanitization } = require('../resources/sanitization');
const { emailValidation, passwordValidation } = require('../resources/validations');

exports.getUserInfo = async (req, res, next) => {
	console.log('[getUserInfo] (controller)');
	try {
		console.log('not implemented yet');

		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'FOUND', success: true });

	} catch (error) {
		next(error)
	}
}

exports.updateUser = async (req, res, next) => {
	console.log('[updateUser] (controller)');
	try {
		console.log('not implemented yet');

		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData: tokenCookieData, code: 'UPDATED', success: true });
	} catch (error) {
		next(error)
	}
}

exports.deleteUser = async (req, res, next) => {
	console.log('[deleteUser] (controller)');
	try {
		console.log('not implemented yet');

		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ code: 'DELETED', success: true });

	} catch (error) {
		next(error)
	}
}