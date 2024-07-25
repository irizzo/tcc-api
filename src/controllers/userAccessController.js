const userService = require('../services/userService');
const userAccessService = require('../services/userAccessService');

// resources
const CustomError = require('../resources/error')
const { encryptPlainPass, comparePlainAndHash } = require('../resources/encrypt');
const { generalSanitization } = require('../resources/sanitization');
const { emailValidation, passwordValidation } = require('../resources/validations');
const { validateToken } = require('../resources/userAuth');

// verificar se o usuário está com o token válido
exports.verifyUserAuth = async (req, res, next) => {
	console.log('[verifyUserAuth] controller');
	try {
		const { authorization } = req.headers;
		const decodedToken = validateToken(authorization);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: decodedToken.data.userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'LOGGED_IN', success: true });
	} catch (error) {
		next(error)
	}
}

// registro de novo usuário
exports.signUp = async (req, res, next) => {
	console.log('[signUp] (controller)');
	try {
		const { firstName, lastName, email, password } = req.body;

		// sanitization 
		const cleanUser = {
			firstName: generalSanitization(firstName),
			lastName: generalSanitization(lastName),
			password: generalSanitization(password),
			email: generalSanitization(email)
		};

		// validations
		if (!cleanUser.firstName || !cleanUser.lastName || !cleanUser.email || !cleanUser.password) {
			throw CustomError('EMPTY_FIELD', 400);
		};

		if (!passwordValidation(cleanUser.password)) {
			throw CustomError('INVALID_PASSWORD', 400);
		}

		if (!emailValidation(cleanUser.email)) {
			throw CustomError('INVALID_EMAIL', 400);
		}

		// email must be unique
		const emailMatchList = await userService.getUserByEmailService(cleanUser.email);
		if (emailMatchList.length > 0) {
			throw CustomError('EMAIL_NOT_UNIQUE', 400);
		}

		cleanUser.password = encryptPlainPass(password);

		const createdUserId  = await userService.createNewUserService(cleanUser);
		
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: createdUserId });
		
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(201).send({ tokenCookieData, code: 'CREATED', result: { createdUserId: createdUserId }, success: true });
	} catch (error) {
		next(error);
	}
}

// login
exports.login = async (req, res, next) => {
	console.log('[login] (controller)')
	try {
		const { email, password } = req.body;

		// sanitization 
		const cleanLogInInfo = {
			password: generalSanitization(password),
			email: generalSanitization(email)
		}

		// validations
		if (!passwordValidation(cleanLogInInfo.password)) {
			throw CustomError('INVALID_PASSWORD', 400);
		}

		if (!emailValidation(cleanLogInInfo.email)) {
			throw CustomError('INVALID_EMAIL', 400);
		}

		const userMatchList = await userService.getUserByEmailService(cleanLogInInfo.email);
		if (userMatchList.length === 0) {
			throw CustomError('EMAIL_NOT_REGISTERED', 400);
		}

		if (!comparePlainAndHash(cleanLogInInfo.password, userMatchList[0].password)) {
			throw CustomError('INCORRECT_PASSWORD', 400);
		}

		const tokenCookieData = await userService.loginService(userMatchList[0]);
		
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		
		res.status(200).send({ tokenCookieData, code: 'USER_LOGGED_IN', success: true });

	} catch (error) {
		next(error);
	}
}

// logout
exports.logout = async (req, res, next) => {
	console.log('[logout] controller');
	try {
		res.clearCookie('token');
		res.status(200).send({ code: 'LOGGED_OUT', success: true });
	} catch (error) {
		next(error);
	}
}
