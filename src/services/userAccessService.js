const { generateTokenFromData } = require('../resources/userAuth');

const domain = process.env.NODE_ENV === 'production' ? process.env.PROD_DOMAIN : process.env.DEV_DOMAIN;

exports.generateTokenCookieData = (tokenData) => {
	console.log('[generateTokenCookieData] (service)');
	
	const generatedToken = generateTokenFromData({ ...tokenData });

	return {
		name: 'token',
		value: generatedToken,
		options: {
			maxAge: 60 * 60,
			sameSite: 'strict',
			secure: true,
			// domain: domain
		}
	}
}

