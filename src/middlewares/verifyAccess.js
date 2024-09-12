
const { validateToken } = require('../resources/userAuth');
const CustomError = require('../resources/error');
const userService = require('../services/userService');

function handleAuthHeader(authHeader) {
	if (!authHeader) {
		return false
	}

	const decodedToken = validateToken(authHeader);

	if (!decodedToken.data.userId) {
		return false
	}

	return decodedToken.data
}

async function verifyAccessToken(req, res, next) {
	console.log('[verifyAccessToken] [middleware]');
	try {
		const { authorization } = req.headers;

		const authRes = handleAuthHeader(authorization);

		if (!authRes) {
			throw CustomError('NOT_AUTHORIZED', 401)
		}

		const userId = authRes.userId;

		if (! await userService.getUserByIdService(userId)) {
			throw CustomError('USER_NOT_FOUND', 404)
		}

		next();
	} catch (error) {
		console.log('[verifyAccessToken] [middleware] error:', error);
		next(error)
	}
}

async function checkAdminAuth(req, res, next) {
	console.log('[checkAdminAuth] [middleware]');

	try {
		const { authorization } = req.headers;
		const authRes = handleAuthHeader(authorization);

		if (!authRes) {
			throw CustomError('NOT_AUTHORIZED', 401)
		}

		const userId = authRes.userId;
		const userFound = await userService.getUserByIdService(userId);

		if (!userFound) {
			throw CustomError('USER_NOT_FOUND', 404)
		}

		if (userFound.email !== process.env.ADMIN_AUTH) {
			throw CustomError('NOT_AUTHORIZED', 401)
		}

		next();

	} catch (error) {
		console.log('[checkAdminAuth] [middleware] error:', error);
		next(error)
	}
}

module.exports = {
	verifyAccessToken,
	checkAdminAuth
};
