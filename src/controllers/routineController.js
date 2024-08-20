const routineService = require('../services/routineService');
const userAccessService = require('../services/userAccessService');

const CustomError = require('../resources/error');
const { extractDataFromToken } = require('../resources/userAuth');
const { titleValidation, routineTimeValidation, routineActiveTimeValidation } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');

exports.createNewRoutine = async (req, res, next) => {
	console.log('[createNewRoutine] (controller)');

	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const { title, description, startOfActiveTime, endOfActiveTime } = req.body;

		// sanitization
		const cleanInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			startOfActiveTime: startOfActiveTime === null ? null : startOfActiveTime,
			endOfActiveTime: endOfActiveTime === null ? null : endOfActiveTime,
		}

		// validation
		if (!titleValidation(cleanInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanInfo.startOfActiveTime && !routineTimeValidation(cleanInfo.startOfActiveTime)) {
			throw CustomError('INVALID_START_TIME' , 400);
		}

		if (cleanInfo.endOfActiveTime && !routineTimeValidation(cleanInfo.endOfActiveTime)) {
			throw CustomError('INVALID_END_TIME' , 400);
		}

		if (cleanInfo.startOfActiveTime && cleanInfo.endOfActiveTime && !routineActiveTimeValidation(cleanInfo.startOfActiveTime, cleanInfo.endOfActiveTime)) {
			throw CustomError('INVALID_TIME_INTERVAL' , 400)
		}

		const createdRoutineId = await routineService.createNewRoutine(userId, cleanInfo);
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId});
		
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(201).send({ tokenCookieData, code: 'CREATED', result: createdRoutineId, success: true });

	} catch (error) {
		next(error);
	}
}

exports.getUserRoutines = async (req, res, next) => {
	console.log('[getUserRoutines] (controller)');
	try {
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const routineList = await routineService.getUserRoutines(userId);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);

		res.status(200).send({ tokenCookieData, code: 'FOUND', result: routineList, success: true });
	} catch (error) {
		next(error);
	}
}

exports.getRoutineDetails = async (req, res, next) => {
	console.log('[getRoutineDetails] (controller)');
	try {
		const { routineId } = req.params;
		
		if (!routineId) {
			throw CustomError('ROUTINE_ID_NOT_FOUND', 400);
		}

		const foundRoutine = await routineService.getUserRoutineById(routineId);
		if (!foundRoutine) {
			throw CustomError('ROUTINE_NOT_FOUND', 404);
		}
		
		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'FOUND', result: foundRoutine.data(), success: true });

	} catch (error) {
		next(error);
	}
}

exports.updateRoutine = async (req, res, next) => {
	console.log('[updateRoutine] (controller)');
	try {
		const { routineId } = req.params;
		
		if (!routineId) {
			throw CustomError('ROUTINE_ID_NOT_FOUND', 400);
		}
		
		if (!await routineService.getUserRoutineById(routineId)) {
			throw CustomError('ROUTINE_NOT_FOUND', 404);
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
			res.status(200).send({ tokenCookieData, code: 'OK', success: true });
			return;
		}
		
		// validation
		if (cleanInfo.title && !titleValidation(cleanInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanInfo.startOfActiveTime && !routineTimeValidation(cleanInfo.startOfActiveTime)) {
			throw CustomError('INVALID_START_TIME', 400);
		}
		
		if (cleanInfo.endOfActiveTime && !routineTimeValidation(cleanInfo.endOfActiveTime)) {
			throw CustomError('INVALID_END_TIME', 400);
		}
		
		if (cleanInfo.startOfActiveTime && cleanInfo.endOfActiveTime && !routineActiveTimeValidation(cleanInfo.startOfActiveTime, cleanInfo.endOfActiveTime)) {
			throw CustomError('INVALID_TIME_INTERVAL', 400);
		}
		
		await routineService.updateRoutineDetails(routineId, cleanInfo);

		const userId = extractDataFromToken(req.headers.authorization, "userId");
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'UPDATED', success: true });
	} catch (error) {
		next(error);
	}
}