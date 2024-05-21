const taskService = require('../services/taskService');

// resources
const CustomError = require('../resources/error');
const { getDataFromToken } = require('../resources/userAuth');
const { dueDateValidation, titleValidation, categoryCodeExists, priorityCodeValidation } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');

async function createNewTask(req, res) {
	console.log('[createNewTaskController]');

	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");

		const { title, description, dueDate, categoryCode, priorityCode, toDoDate } = req.body;

		// sanitization
		const cleanTaskInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			dueDate: dueDate === null ? null : new Date(dueDate),
			toDoDate: toDoDate === null ? null : new Date(toDoDate),
			categoryCode: categoryCode === null ? null : generalSanitization(categoryCode),
			priorityCode: priorityCode === null ? null : generalSanitization(priorityCode)
		}

		// validation
		if (!titleValidation(cleanTaskInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanTaskInfo.dueDate && !dueDateValidation(cleanTaskInfo.dueDate)) {
			throw CustomError('INVALID_DUE_DATE', 400);
		}

		if (cleanTaskInfo.toDoDate && !dueDateValidation(cleanTaskInfo.toDoDate)) {
			throw CustomError('INVALID_TO_DO_DATE', 400);
		}

		if (cleanTaskInfo.priorityCode && !priorityCodeValidation(cleanTaskInfo.priorityCode)) {
			throw CustomError('INVALID_PRIORITY_CODE', 400);
		}

		if (cleanTaskInfo.categoryCode && !categoryCodeValidation(userId, cleanTaskInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		const createdTask = await taskService.createNewTask(userId, cleanTaskInfo);

		res.status(201).send({ code: 'CREATED_TASK', result: createdTask, success: true });

	} catch (error) {
		next(error);
	}
}

async function getUserTasks(req, res) {
	console.log('[getUserTasks] (controller)');
	try {
		const tasksList = await taskService.getUserTasks(userId);

		res.status(200).send({ code: 'OK', result: tasksList, success: true });

	} catch (error) {
		next(error);
	}
}

async function getTaskDetails(req, res) {
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

		res.status(200).send({ code: 'OK', result: foundTask.data(), success: true });

	} catch (error) {
		next(error);
	}
}

async function updateTask(req, res) {
	console.log('[updateTaskController]');
	try {
		const userId = getDataFromToken(req.headers.authorization, "userId");

		const { taskId } = req.params;

		if (!taskId) {
			throw CustomError('TASK_ID_NOT_FOUND', 400);
		}

		const foundTask = await taskService.getUserTaskById(taskId);
		if (!foundTask) {
			throw CustomError('TASK_NOT_FOUND', 404);
		}

		const { title, description, dueDate, categoryCode, priorityCode, toDoDate } = req.body;

		// sanitization
		const cleanTaskInfo = {};

		if (title !== null) cleanTaskInfo.title = generalSanitization(title);
		if (description !== null) cleanTaskInfo.description = generalSanitization(description);
		if (dueDate !== null) cleanTaskInfo.dueDate = new Date(dueDate);
		if (toDoDate !== null) cleanTaskInfo.toDoDate = new Date(toDoDate);
		if (categoryCode !== null) cleanTaskInfo.categoryCode = generalSanitization(categoryCode);
		if (priorityCode !== null) cleanTaskInfo.priorityCode = generalSanitization(priorityCode);;

		// validations
		if (cleanTaskInfo.title && !titleValidation(cleanTaskInfo.title)) {
			throw CustomError('INVALID_TITLE', 400);
		}

		if (cleanTaskInfo.dueDate && !dueDateValidation(cleanTaskInfo.dueDate)) {
			throw CustomError('INVALID_DUE_DATE', 400);
		}

		if (cleanTaskInfo.toDoDate && !dueDateValidation(cleanTaskInfo.toDoDate)) {
			throw CustomError('INVALID_TO_DO_DATE', 400);
		}

		if (cleanTaskInfo.priorityCode && !priorityCodeValidation(cleanTaskInfo.priorityCode)) {
			throw CustomError('INVALID_PRIORITY_CODE', 400);
		}

		if (cleanTaskInfo.categoryCode && !categoryCodeExists(userId, cleanTaskInfo.categoryCode)) {
			throw CustomError('INVALID_CATEGORY_CODE', 400);
		}

		// TODO: REVIEW
		const updatedTask = await taskService.updateTask(taskId, cleanTaskInfo);

		res.status(200).send({ code: 'UPDATED_TASK', result: null, success: true });

	} catch (error) {
		next(error);
	}
}

async function deleteTask(req, res) {
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
		res.status(200).send({ code: 'DELETED_TASK', result: null, success: true });

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