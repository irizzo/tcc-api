const { validateToken } = require('../resources/userAuth');
const CreateError = require('../resources/error');
const userService = require('../services/userService');

function handleAuth(authHeader) {
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
	console.log('[verifyAccessToken]');

	const { authorization } = req.headers;

	const authRes = handleAuth(authorization);

	if (!authRes) {
		throw CreateError('NOT_AUTHORIZED', 401)
	}

	const userId = authRes.userId;

	if (! await userService.getUserById(userId)) {
		throw CreateError('USER_NOT_FOUND', 404)
	}

	next();
}

module.exports = verifyAccessToken;