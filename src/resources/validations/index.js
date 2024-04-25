const { getPriorityByCode } = require('../../services/priorityService');
const { getStatusByCode } = require('../../services/statusService');

// TODO: general validation based on the xss pkg

function dueDateValidation(date) {
	const today = new Date();

	if (today > date) {
		return false;
	}

	return true;
}

function endDateValidation(startDate, endDate) {
	if (startDate > endDate) {
		return false
	}

	return true
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
	if (!title || title.length < 1) {
		return false;
	}

	return true;
}

function passwordValidation(password) {
	if (!password || password === "" || password.length === 0) {
		return false;
	}

	const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%¨&*()_+?^.,;:={}\-\[\]])[A-Za-z\d!@#$%¨&*()_+?^.,;:={}\-\[\]]{8,20}$/;
	/* pelo menos 8 caracteres; pelo menos 1 número (0-9); pelo menos 1 letra minúscula; pelo menos 1 letra maiúscula; pelo menos 1 caractere especial; não pode conter os caracteres <>*/

	if(!passPattern.test(password)) {
		return false;
	}

	return true;
}

// TODO: review
async function priorityCodeValidation(priorityCode) {
	if (!priorityCode || priorityCode.length == 0) {
		return true
	}

	const codeMatch = await getPriorityByCode(priorityCode);

	if(!codeMatch || codeMatch.length === 0) {
		return false
	}

	return true;
}

// TODO: categoryCodeValidation
async function categoryCodeValidation(categoryCode) {
	if (categoryCode === null) {
		return true
	}

	// search for matches on BD

	return true;
}

// TODO: review
async function statusCodeValidation(statusCode) {
	const codeMatch = await getStatusByCode(statusCode);

	if (codeMatch.length === 0) {
		return false
	}

	console.log(`codeMatch = ${JSON.stringify(codeMatch)}`);
	return true;
}

function routineTimeValidation(timeArray) {
	if(timeArray[0] < 0 || timeArray[0] > 23) {
		return false
	}

	if (timeArray[1] < 0 || timeArray[1] > 59){
		return false
	}
	
	return true
}

function routineActiveTimeValidation(startTime, endTime) {
	console.log(`startTime = ${startTime}`);
	console.log(`endTime = ${endTime}`);

	if(startTime[0] > endTime[0]) {
		console.log('startTime[0] > endTime[0]');
		console.log(`startTime[0] = ${startTime[0]}`);
		console.log(`endTime[0] = ${endTime[0]}`);

		return false
	}

	if(startTime[0] === endTime[0] && startTime[1] >= endTime[1]) {
		console.log('startTime[0] === endTime[0] && startTime[1] >= endTime[1]');

		return false
	}

	return true
}

module.exports = {
	dueDateValidation,
	endDateValidation,
	emailValidation,
	titleValidation,
	passwordValidation,
	priorityCodeValidation,
	categoryCodeValidation,
	statusCodeValidation,
	routineTimeValidation,
	routineActiveTimeValidation
};