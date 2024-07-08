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
	try {
		console.log('[verifyAccessToken] [middleware]');

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
		next(error)
	}
}

module.exports = verifyAccessToken;