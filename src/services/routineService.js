const routineModel = require('../models/routineModel');

exports.createNewRoutine = async (userId, newRoutineInfo) => {
	console.log('[createNewRoutine] (service)');
	try {
		const routineInfo = {
			...newRoutineInfo,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
			userId
		}

		const createdRoutineId = await routineModel.createDbRoutine(routineInfo);
		return createdRoutineId;

	} catch (error) {
		throw error;
	}
}

exports.getUserRoutines = async (userId) => {
	console.log('[getUserRoutines] (service)');
	try {
		return await routineModel.getUserDbRoutines(userId);
	} catch (error) {
		throw error;
	}
}

exports.getUserRoutineById = async (routineId) => {
	console.log('[getUserRoutineById] (service)');
	try {
		return await routineModel.findDbRoutineById(routineId);
	} catch (error) {
		throw error;
	}
}

exports.updateRoutineDetails = async (routineId, newInfo) => {
	console.log('[updateRoutineDetails] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: new Date(Date.now()) };
		await routineModel.updateEvent(routineId, updatedInfo);
		return;

	} catch (error) {
		throw error;
	}
}

exports.deleteRoutine = async (routineId) => {
	console.log('[deleteRoutine] (service)');
	try {
		// TODO: after routineActivity delete
		return;
	} catch (error) {
		throw error;
	}
}