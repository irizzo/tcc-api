const taskService = require('../services/taskService');
const userAccessService = require('../services/userAccessService');

// resources
const CustomError = require('../resources/error');
const { extractDataFromToken } = require('../resources/userAuth');
const { dueDateValidation, titleValidation, categoryCodeExists, priorityCodeValidation } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');

async function createNewTask(req, res, next) {
	console.log('[createNewTaskController]');

	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');

		const { title, description, dueDate, categoryCode, priorityCode, schedueledDate } = req.body;
		
		console.log('req.body = ', { title, description, dueDate, categoryCode, priorityCode, schedueledDate })
		
		// sanitization
		const cleanTaskInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			dueDate: dueDate === null ? null : new Date(dueDate),
			schedueledDate: schedueledDate === null ? null : new Date(schedueledDate),
			categoryCode: categoryCode === null ? null : generalSanitization(categoryCode),
			priorityCode: priorityCode === null ? null : generalSanitization(priorityCode)
		}
		
		console.log('cleanTaskInfo: ', cleanTaskInfo); 
		
		// validation
		if (!titleValidation(cleanTaskInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}
		
		if (cleanTaskInfo.dueDate && !dueDateValidation(cleanTaskInfo.dueDate)) {
			throw CustomError('INVALID_DUE_DATE', 400);
		}
		
		if (cleanTaskInfo.schedueledDate && !dueDateValidation(cleanTaskInfo.schedueledDate)) {
			throw CustomError('INVALID_SCHEDUELED_DATE', 400);
		}
		
		if (cleanTaskInfo.priorityCode && !priorityCodeValidation(cleanTaskInfo.priorityCode)) {
			throw CustomError('INVALID_PRIORITY_CODE', 400);
		}
		
		if (cleanTaskInfo.categoryCode && !categoryCodeExists(userId, cleanTaskInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		const createdTaskId = await taskService.createNewTask(userId, cleanTaskInfo);

		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });
		
		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(201).send({ tokenCookieData, code: 'CREATED', result: createdTaskId, success: true });

	} catch (error) {
		next(error);
	}
}

async function getUserTasks(req, res, next) {
	console.log('[getUserTasks] (controller)');
	try {
		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tasksList = await taskService.getUserTasks(userId);
		
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'FOUND', result: tasksList, success: true });

	} catch (error) {
		next(error);
	}
}

async function getTaskDetails(req, res, next) {
	console.log('[getTaskDetails] (controller)');
	try {
		const { taskId } = req.params;

		if (!taskId) {
			throw CustomError('TASK_ID_NOT_FOUND', 400);
		}

		const foundTask = await taskService.getUserTaskById(taskId);
		if (!foundTask) {
			throw CustomError('TASK_NOT_FOUND', 404);
		}

		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'FOUND', result: foundTask, success: true });

	} catch (error) {
		next(error);
	}
}

async function updateTask(req, res, next) {
	console.log('[updateTaskController]');
	try {
		const { taskId } = req.params;
		
		if (!taskId) {
			throw CustomError('TASK_ID_NOT_FOUND', 400);
		}

		const foundTask = await taskService.getUserTaskById(taskId);
		if (!foundTask) {
			throw CustomError('TASK_NOT_FOUND', 404);
		}

		const { title, description, dueDate, categoryCode, priorityCode, schedueledDate, statusCode } = req.body;


		console.log('[updateTaskController] req.body: ', { title, description, dueDate, categoryCode, priorityCode, schedueledDate, statusCode });

		// sanitization
		const cleanTaskInfo = {};

		if (title !== null) cleanTaskInfo.title = generalSanitization(title);
		if (description !== null) cleanTaskInfo.description = generalSanitization(description);
		if (dueDate !== null) cleanTaskInfo.dueDate = new Date(dueDate);
		if (schedueledDate !== null) cleanTaskInfo.schedueledDate = new Date(schedueledDate);
		if (categoryCode !== null) cleanTaskInfo.categoryCode = generalSanitization(categoryCode);
		if (priorityCode !== null) cleanTaskInfo.priorityCode = generalSanitization(priorityCode);
		if (statusCode !== null) cleanTaskInfo.statusCode = generalSanitization(statusCode);
		
		console.log('[updateTaskController] cleanTaskInfo: ', cleanTaskInfo);

		const uId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: uId });
		
		// validations
		if (!cleanTaskInfo.title && !cleanTaskInfo.description && !cleanTaskInfo.categoryCode && !cleanTaskInfo.priorityCode && !cleanTaskInfo.dueDate && !cleanTaskInfo.schedueledDate && !cleanTaskInfo.statusCode) {
			// nothing to change
			res.status(200).send({ tokenCookieData, code: 'OK', success: true });
			return;
		}

		if (cleanTaskInfo.title && !titleValidation(cleanTaskInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanTaskInfo.dueDate && !dueDateValidation(cleanTaskInfo.dueDate)) {
			throw CustomError('INVALID_DUE_DATE', 400);
		}

		if (cleanTaskInfo.schedueledDate && !dueDateValidation(cleanTaskInfo.schedueledDate)) {
			throw CustomError('INVALID_SCHEDUELED_DATE', 400);
		}

		if (cleanTaskInfo.priorityCode && !priorityCodeValidation(cleanTaskInfo.priorityCode)) {
			throw CustomError('INVALID_PRIORITY_CODE', 400);
		}

		if (cleanTaskInfo.categoryCode && !categoryCodeExists(uId, cleanTaskInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		await taskService.updateTaskInfo(taskId, cleanTaskInfo);

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'UPDATED', success: true });

	} catch (error) {
		console.log('[updateTaskController] error: ', error);
		next(error);
	}
}

async function deleteTask(req, res, next) {
	console.log('[deleteTaskController]');

	try {
		const { taskId } = req.params;

		if (!taskId) {
			throw CustomError('TASK_ID_NOT_FOUND', 400);
		}

		if (! await taskService.getUserTaskById(taskId)) {
			throw CustomError('TASK_NOT_FOUND', 404);
		}

		await taskService.deleteTask(taskId);

		const userId = extractDataFromToken(req.headers.authorization, 'userId');
		const tokenCookieData = userAccessService.generateTokenCookieData({ userId: userId });

		res.cookie(tokenCookieData.name, tokenCookieData.value, tokenCookieData.options);
		res.status(200).send({ tokenCookieData, code: 'DELETED', success: true });

	} catch (error) {
		next(error);
	}
}

module.exports = {
	createNewTask,
	getUserTasks,
	getTaskDetails,
	updateTask,
	deleteTask
}
