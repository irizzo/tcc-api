const routineService = require('../services/routineService');

const { titleValidation, routineTimeValidation, routineActiveTimeValidation, isObjEmpty } = require('../resources/validations');
const { generalSanitization } = require ('../resources/sanitization')

// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

exports.createNewRoutine = async (req, res) => {
	console.log('[createNewRoutine] (controller)');

	try {
		// validate user session

		const { title, description, startOfActiveTime, endOfActiveTime } = req.body;
		
		// sanitization
		const cleanInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			startOfActiveTime: startOfActiveTime === null ? null : startOfActiveTime,
			endOfActiveTime: endOfActiveTime === null ? null : endOfActiveTime, 
		}
		
		// validation
		if(!titleValidation(cleanInfo.title)) {
			res.status(400).send({ code: 'INVALID_TITLE', result: null, success: false });
			return;
		}

		if (cleanInfo.startOfActiveTime && !routineTimeValidation(cleanInfo.startOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_START_TIME', result: null, success: false });
			return;
		}

		if (cleanInfo.endOfActiveTime && !routineTimeValidation(cleanInfo.endOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_END_TIME', result: null, success: false });
			return;
		}

		if (cleanInfo.startOfActiveTime && cleanInfo.endOfActiveTime && !routineActiveTimeValidation(cleanInfo.startOfActiveTime, cleanInfo.endOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_TIME_INTERVAL', result: null, success: false });
			return;
		}

		const createdRoutineId = await routineService.createNewRoutine(userId, cleanInfo);

		res.status(201).send({ code: 'CREATED_ROUTINE', result: createdRoutineId, success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

exports.getUserRoutines = async (req, res) => {
	console.log('[getUserRoutines] (controller)');
	try {
		// user validation

		const routineList = await routineService.getUserRoutines(userId);

		res.status(200).send({ code: 'OK', result: routineList, success: true });
	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

exports.getRoutineDetails = async (req, res) => {
	console.log('[getRoutineDetails] (controller)');
	try {
		// user validation

		const { routineId } = req.params;

		const foundRoutine = await routineService.getUserRoutineById(routineId);
		if (!foundRoutine) {
			res.status(404).send({ code: 'ROUTINE_NOT_FOUND', result: null, success: false });
			return;
		}

		res.status(200).send({ code: 'OK', result: foundRoutine.data(), success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

exports.updateRoutineInfo = async (req, res) => {
	console.log('[updateRoutineInfo] (controller)');
	try {
		// user validation

		const { routineId } = req.params;

		const foundRoutine = await routineService.getUserRoutineById(routineId);
		if (!foundRoutine) {
			res.status(404).send({ code: 'ROUTINE_NOT_FOUND', result: null, success: false });
			return;
		}

		const { title, description, startOfActiveTime, endOfActiveTime } = req.body;

		// sanitization
		const cleanInfo = {
			title: title === null ? null : generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			startOfActiveTime: startOfActiveTime === null ? null : startOfActiveTime,
			endOfActiveTime: endOfActiveTime === null ? null : endOfActiveTime,
		}

		// check if there's any info to update
		if (!cleanInfo.title && !cleanInfo.description && !cleanInfo.startOfActiveTime && !cleanInfo.endOfActiveTime) {
			// nothing to change
			res.status(200).send({ code: 'OK', result: null, success: true });
			return;
		}

		// validation
		if (cleanInfo.title && !titleValidation(cleanInfo.title)) {
			res.status(400).send({ code: 'INVALID_TITLE', result: null, success: false });
			return;
		}

		if (cleanInfo.startOfActiveTime && !routineTimeValidation(cleanInfo.startOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_START_TIME', result: null, success: false });
			return;
		}

		if (cleanInfo.endOfActiveTime && !routineTimeValidation(cleanInfo.endOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_END_TIME', result: null, success: false });
			return;
		}

		if (cleanInfo.startOfActiveTime && cleanInfo.endOfActiveTime && !routineActiveTimeValidation(cleanInfo.startOfActiveTime, cleanInfo.endOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_TIME_INTERVAL', result: null, success: false });
			return;
		}

		await routineService.updateRoutineDetails(routineId, cleanInfo);

		res.status(200).send({ code: 'UPDATED_ROUTINE', result: null, success: true });
	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		console.log(`ERROR = ${error}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}