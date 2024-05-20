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

// TODO: create custom errors for better error handling
exports.handleAuth = (authHeader) => {
	try {
		if(!authHeader) {
			return false
		}

		const decodedToken = this.validateToken(authHeader);

		console.log(`decodedToken = ${JSON.stringify(decodedToken)}`)
		
		if (!decodedToken.data.userId) {
			throw new Error('userID not found');
		}

		return decodedToken.data
		
	} catch (error) {
		throw error;
	}
}