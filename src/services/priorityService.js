const priorityModel = require('../models/priorityModel');

async function getPriorities(userId) {
	console.log('[getPriorities] (service)');
	try {
		const prioritiesList = await priorityModel.getAllDbPriorities(userId);
		return prioritiesList;

	} catch (error) {
		throw error;
	}
}

async function getPriorityByCode(priorityCode) {
	console.log('[getPriorityByCode] (service)');
	try {
		const match = await priorityModel.findPriorityByCode(priorityCode);
		return match;

	} catch (error) {
		throw error;
	}
}

module.exports = {
	getPriorities,
	getPriorityByCode,
}