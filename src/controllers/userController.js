const userService = require('../services/userService');
const userAccessService = require('../services/userAccessService')

// resources
const CustomError = require('../resources/error');
const { extractDataFromToken } = require('../resources/userAuth');

exports.getUserInfo = async (req, res, next) => {
	console.log('[getUserInfo] (controller)');
	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");

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
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'UPDATED', success: true });
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