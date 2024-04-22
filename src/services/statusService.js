const statusModel = require('../models/statusModel');

async function getStatus(userId) {
	console.log('[getStatus] (service)');
	try {
		const prioritiesList = await statusModel.getAllDbStatus(userId);
		return prioritiesList;

	} catch (error) {
		throw error;
	}
}

async function getStatusByCode(statusCode) {
	console.log('[getStatusByCode] (service)');
	try {
		const match = await statusModel.findStatusByCode(statusCode);
		return match;

	} catch (error) {
		throw error;
	}
}

module.exports = {
	getStatus,
	getStatusByCode,
}