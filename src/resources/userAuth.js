const jwt = require('jsonwebtoken');

const privateKey = process.env.JWT_SECRET;

exports.generateTokenFromUserId = (userId) => {
	try {
		return jwt.sign({ data: { userId } }, privateKey, { expiresIn: '3d' });
	} catch (error) {
		throw error;
	}
}

exports.validateToken = (token) => {
	try {
		const verifiedToken = jwt.verify(token, privateKey);
		if(!verifiedToken.data) {
			return false
		}
		return verifiedToken

	} catch (error) {
		throw error;
	}
}