const routineService = require('../services/routineService');

const { titleValidation, routineTimeValidation, routineActiveTimeValidation } = require('../resources/validations');
const { generalSanitization } = require ('../resources/sanitization')

// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

exports.createNewRoutine = async (req, res) => {
	console.log('[createNewRoutine] (controller)');

	try {
		// validate user session

		const { title, startOfActiveTime, endOfActiveTime } = req.body;
		
		// sanitization
		const cleanRoutineInfo = {
			title: generalSanitization(title),
			startOfActiveTime: startOfActiveTime,
			endOfActiveTime: endOfActiveTime,
		}
		
		// validation
		if(!titleValidation(cleanRoutineInfo.title)) {
			res.status(400).send({ code: 'INVALID_TITLE', result: null, success: false });
			return;
		}

		if (!routineTimeValidation(cleanRoutineInfo.startOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_START_TIME', result: null, success: false });
			return;
		}

		if (!routineTimeValidation(cleanRoutineInfo.endOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_END_TIME', result: null, success: false });
			return;
		}

		if (!routineActiveTimeValidation(cleanRoutineInfo.startOfActiveTime, cleanRoutineInfo.endOfActiveTime)) {
			res.status(400).send({ code: 'INVALID_TIME_INTERVAL', result: null, success: false });
			return;
		}

		const createdRoutineId = await routineService.createNewRoutine(userId, cleanRoutineInfo);

		res.status(201).send({ code: 'CREATED_ROUTINE', result: createdRoutineId, success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

exports.getUserRoutines = async (req, res) => {
	console.log('[createNewRoutine] (controller)');
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
	console.log('[createNewRoutine] (controller)');
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