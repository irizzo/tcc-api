const userModel = require('../models/userModel');

const userService = require('../services/userService');

// resources
// const { encrypt, compare } = require('../resources/cryptography');
const { encryptPlainPass, comparePlainAndHash } = require('../resources/bcrypt');
const { generalSanitization } = require('../resources/sanitization');
const { emailValidation, passwordValidation } = require('../resources/validations');

async function createNewUser(req, res) {
	console.log('[createNewUserController]');
	try {
		const { firstName, lastName, email, password } =  req.body;
	
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

		if(!passwordValidation(cleanUser.password)) {
			throw CustomError('INVALID_PASSWORD', 400);
		}

		if (!emailValidation(cleanUser.email)) {
			throw CustomError('INVALID_EMAIL', 400);
		}

		// email must be unique
		const emailMatchList = await userService.getUserByEmail(cleanUser.email);
		if(emailMatchList.length > 0) {
			throw CustomError('EMAIL_NOT_UNIQUE', 400);
		}

		cleanUser.password = encryptPlainPass(password);

		const createdUserData = await userService.createNewUser(cleanUser);
		
		res.status(201).send({ code: 'USER_CREATED', result: createdUserData, success: true });
		
	} catch (error) {
		next(error);
	}
}

async function userLogin(req, res) {
	try {
		console.log('[logInUser]');

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

		const emailMatchList = await userService.getUserByEmail(cleanLogInInfo.email);
		if (emailMatchList.length === 0) {
			throw CustomError('EMAIL_NOT_REGISTERED', 400);
		}
		
		if (!comparePlainAndHash(cleanLogInInfo.password, emailMatchList[0].password)) {
			throw CustomError('INCORRECT_PASSWORD', 400);
		}

		const loginInfo = await userService.login(emailMatchList[0]);

		// set cookies

		res.status(200).send({ code: 'USER_LOGGED_IN', result: loginInfo, success: true });
		
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createNewUser,
	userLogin,
}