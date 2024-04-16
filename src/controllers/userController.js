const userModel = require('../models/userModel');

// resources
const { encrypt, compare } = require('../resources/cryptography'); 
const { sanitizeString, sanitizeEmail } = require('../resources/sanitization');
const { emailValidation, passwordValidation } = require('../resources/validations');

async function getUserByEmail(userEmail) {
	const matchList = await userModel.findUserByEmail(userEmail);

	return matchList;
}

async function createUser(req, res) {
	try {
		console.log('[createUserController]');

		const { firstName, lastName, email, password } =  req.body;
	
		// sanitization 
		let cleanUser = {
			firstName: '',
			lastName: '',
			email: '',
			password: ''
		};

		cleanUser.firstName = sanitizeString(firstName);
		cleanUser.lastName = sanitizeString(lastName);
		cleanUser.password = sanitizeString(password);
		cleanUser.email = sanitizeEmail(email);

		// validations
		if (!cleanUser.firstName || !cleanUser.lastName || !cleanUser.email || !cleanUser.password) {
			res.status(400).send({
				code: 'EMPTY_FIELD',
				result: null,
				success: false
			});

			return;
		};

		// if(!passwordValidation(cleanUser.password)) {
		// 	res.status(400).send({
		// 		code: 'INVALID_PASSWORD',
		// 		result: null,
		// 		success: false
		// 	});
			
		// 	return;
		// }

		if (!emailValidation(cleanUser.email)) {
			res.status(400).send({
				code: 'INVALID_EMAIL',
				result: null,
				success: false
			});

			return;
		}

		// email must be unique
		const emailMatchList = await getUserByEmail(cleanUser.email);

		if(emailMatchList.length < 0) {
			res.status(400).send({
				code: 'EMAIL_NOT_UNIQUE',
				result: null,
				success: false
			});

			return;
		}

		cleanUser.password = encrypt(password);

		console.log(`CleanUser = ${JSON.stringify(cleanUser)}`);

		const createdUserId = await userModel.createDbUser(cleanUser);
		
		console.log(`[createUserId] createdUserId = ${createdUserId}`);

		res.status(200).send({
			code: 'USER_CREATED',
			result: createdUserId,
			success: true
		});
		
	} catch (error) {
		console.log(`ERROR: ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function login(req, res) {
	try {
		console.log('[logInUser]');

		const { email, password } = req.body;

		// sanitization 
		const cleanLogInInfo = {
			email: '',
			password: ''
		}

		cleanLogInInfo.password = sanitizeString(password);
		cleanLogInInfo.email = sanitizeEmail(email);

		// validations
		if (!cleanLogInInfo.email || !cleanLogInInfo.password) {
			res.status(400).send({
				code: 'EMPTY_FIELD',
				result: null,
				success: false
			});

			return;
		};

		// if (!passwordValidation(cleanLogInInfo.password)) {
		// 	res.status(400).send({
		// 		code: 'INVALID_PASSWORD',
		// 		result: null,
		// 		success: false
		// 	});

		// 	return;
		// }

		if (!emailValidation(cleanLogInInfo.email)) {
			res.status(400).send({
				code: 'INVALID_EMAIL',
				result: null,
				success: false
			});

			return;
		}

		const emailMatchList = await getUserByEmail(cleanLogInInfo.email);
		if (emailMatchList.length === 0) {
			res.status(400).send({
				code: 'EMAIL_NOT_REGISTERED',
				result: null,
				success: false
			});

			return;
		}

		console.log(`emailMatchList = ${JSON.stringify(emailMatchList)}`);

		if (!compare(cleanLogInInfo.password, emailMatchList[0].password)) {
			res.status(400).send({
				code: 'INCORRECT_PASSWORD',
				result: null,
				success: false
			});

			return;
		}

		// Log in user

		res.status(200).send({
			code: 'USER_LOGGED_IN',
			result: null,
			success: true
		});
		
	} catch (error) {
		console.log(`ERROR: ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

module.exports = {
	createUser,
	login
}