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
		const decodedToken = jwt.verify(token, privateKey);
		if(!decodedToken.data) {
			return false
		}
		return decodedToken

	} catch (error) {
		throw error;
	}
}

exports.decodeToken = (token) => {
	try {
		const decoded = jwt.decode(token);
		return decoded;

	} catch (error) {
		throw error;
	}
}