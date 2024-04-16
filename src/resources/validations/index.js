function dueDateValidation(date) {
	const today = new Date();

	if (today > date) {
		return false;
	}

	return true;
}

function emailValidation(email) {
	const emailPattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

	if (email === '' || !email || email.length === 0) {
		return false;
	}

	if (!emailPattern.test(email)) {
		return false;
	}

	return true;
}

function titleValidation(title) {
	if (!title || title.length < 3) {
		return false;
	}

	return true;
}

function passwordValidation(password) {
	if (!password || password === "" || password.length === 0) {
		console.log(`!password || password === "" || password.length === 0`);
		return false;
	}

	const passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.* [\W])(?!.*\s){8,}$/;
	/* pelo menos 8 caracteres; pelo menos 1 número (0-9); pelo menos 1 letra minúscula; pelo menos 1 letra maiúscula; pelo menos 1 caractere especial; não pode ter espaços em branco */

	if(!passPattern.test(password)) {
		console.log(`!passPattern.test(password)`);
		return false;
	}

	console.log('valid pass');

	return true;
}

// TODO: priorityCodeValidation
function priorityCodeValidation(priorityCode) {
	return true;
}

// TODO: categoryCodeValidation
function categoryCodeValidation(categoryCode) {
	return true;
}

// TODO: statusCodeValidation
function statusCodeValidation(statusCode) {
	return true;
}

module.exports = {
	dueDateValidation,
	emailValidation,
	titleValidation,
	passwordValidation,
	priorityCodeValidation,
	categoryCodeValidation,
	statusCodeValidation
};