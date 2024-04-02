const userModel = require('../models/userModel')

/* mock user
	{	
		firstName: "Firstname",
		lastName: "Lastname",
		email: "firstlast@gmail.com",
		password: "firstlast"
	}
*/

async function createUser(req, res) {
	try {
		console.log('[createUserController]');

		const { firstName, lastName, email, password } =  req.body;
		const cleanUser = {
			firstName,
			lastName,
			email,
			password
		}
		
		//sanitation 
		// let cleanUser = {
		// 	firstName: '',
		// 	lastName: '',
		// 	email: '',
		// 	password: ''
		// }

		const createdUserId = await userModel.createDbUser(cleanUser)
		
		console.log(`[createUserId] createdUserId = ${JSON.stringify(createdUserId)}`);

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

module.exports = {
	createUser,
}