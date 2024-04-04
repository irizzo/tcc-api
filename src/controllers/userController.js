const userModel = require('../models/userModel');
const { encrypt } = require('../resources/cryptography'); 
const { sanitizeString, sanitizeEmail } = require('../resources/sanitization');
const { emailValidation, passwordValidation } = require('../resources/validations');

/* mock user
	{	
		firstName: "Firstname",
		lastName: "Lastname",
		email: "firstlast@gmail.com",
		password: "firstlast"
	}
*/

async function isEmailUnique(userEmail) {
	const match = await userModel.getUserByEmail(userEmail);

	if (match.length > 0) {
		console.log('email is not unique');
		return false
	}

	return true
}

async function createUser(req, res) {
	try {
		console.log('[createUserController]');

		const { firstName, lastName, email, password } =  req.body;
	
		// sanitation 
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

		if(!passwordValidation(cleanUser.password)) {
			res.status(400).send({
				code: 'INVALID_PASSWORD',
				result: null,
				success: false
			});
			
			return;
		}

		if (!emailValidation(cleanUser.email)) {
			res.status(400).send({
				code: 'INVALID_EMAIL',
				result: null,
				success: false
			});

			return;
		}

		// email must be unique
		const uniqueEmail = await isEmailUnique(cleanUser.email);

		if(!uniqueEmail) {
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

async function logInUser(req, res) {
	try {
		
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
	logInUser
}