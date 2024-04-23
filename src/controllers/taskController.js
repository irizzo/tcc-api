const userModel = require('../models/userModel'); // TODO: userService

const taskService = require('../services/taskService'); 

// resources
const { dueDateValidation, titleValidation, categoryCodeValidation, priorityCodeValidation, statusCodeValidation } = require('../resources/validations');
const { generalSanitization } = require('../resources/sanitization');

// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

async function createNewTask(req, res) {
	console.log('[createNewTaskController]');
	
	try {
		const { title, description, dueDate, categoryCode, priorityCode, toDoDate } = req.body;

		// TODO: userSession

		// sanitization
		const cleanTaskInfo = {
			title: generalSanitization(title),
			description: description === null ? null : generalSanitization(description),
			dueDate: dueDate === null ? null : new Date(dueDate),  // TODO: handle date https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
			toDoDate: toDoDate === null ? null : new Date(toDoDate),
			categoryCode: categoryCode === null ? null : generalSanitization(categoryCode),
			priorityCode: priorityCode === null ? null : generalSanitization(priorityCode)
		}

		// validation
		if (!titleValidation(cleanTaskInfo.title)) {
			res.status(400).send({ code: 'INVALID_TITLE', result: null, success: false });
			return;
		}

		if (cleanTaskInfo.dueDate === null) {
		} else if (!dueDateValidation(cleanTaskInfo.dueDate)) {
			res.status(400).send({ code: 'INVALID_DUE_DATE', result: null, success: false });
			return;
		}

		if (cleanTaskInfo.toDoDate === null) {
		} else if (!dueDateValidation(cleanTaskInfo.toDoDate)) {
			res.status(400).send({ code: 'INVALID_DUE_DATE', result: null, success: false });
			return;
		}
		
		if(cleanTaskInfo.priorityCode === null ) {
		} else if (!priorityCodeValidation(cleanTaskInfo.priorityCode)) {
			res.status(400).send({ code: 'INVALID_PRIORITY_CODE', result: null, success: false });
			return;
		}
		
		// TODO: Category validation
		if (cleanTaskInfo.categoryCode === null) {

		} else if (!categoryCodeValidation(cleanTaskInfo.categoryCode)) {
			res.category(400).send({
				code:'INVALID_CATEGORY_CODE',
				result: null,
				success: false
			});
			return;
		}

		const createdTask = await taskService.createNewTask(userId, cleanTaskInfo);

		res.status(201).send({
			code: 'CREATED_TASK',
			result: createdTask,
			success: true
		});

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

async function getAllTasks(req, res) {
	console.log('[getAllTasks] (controller)');
	try {
		// TODO: userSession

		const tasksList = await taskService.getUserTasks(userId);

		res.status(200).send({ code: 'OK', result: tasksList, success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

async function getTaskDetails(req, res) {
	console.log('[getTaskDetails] (controller)');
	try {
		// TODO: userSession

		const { taskId } = req.params;

		const foundTask = await taskService.getUserTaskById(taskId);
		if (!foundTask) {
			res.status(404).send({ code: 'TASK_NOT_FOUND', result: null, success: false });
			return;
		}

		res.status(200).send({ code: 'OK', result: foundTask.data(), success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

async function updateTaskInfo(req, res) {
	console.log('[updateTaskInfoController]');
	try {
		// TODO: userSession

		const { taskId } = req.params;

		const foundTask = await taskService.getUserTaskById(taskId);
		if (!foundTask) {
			res.status(404).send({ code: 'TASK_NOT_FOUND', result: null, success: false });
			return;
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
			res.status(400).send({ code: 'INVALID_TITLE', result: null, success: false });
			return;
		}

		if (cleanTaskInfo.dueDate && !dueDateValidation(cleanTaskInfo.dueDate)) {
			res.status(400).send({ code: 'INVALID_DUE_DATE', result: null, success: false });
			return;
		}

		if (cleanTaskInfo.toDoDate && !dueDateValidation(cleanTaskInfo.toDoDate)) {
			res.status(400).send({ code: 'INVALID_DUE_DATE', result: null, success: false });
			return;
		}

		if (cleanTaskInfo.priorityCode && !priorityCodeValidation(cleanTaskInfo.priorityCode)) {
			res.status(400).send({ code: 'INVALID_PRIORITY_CODE', result: null, success: false });
			return;
		}

		// TODO: Category validation
		if (cleanTaskInfo.categoryCode && !categoryCodeValidation(cleanTaskInfo.categoryCode)) {
			res.category(400).send({
				code: 'INVALID_CATEGORY_CODE',
				result: null,
				success: false
			});
			return;
		}

		const updatedTask = await taskService.updateTaskInfo(taskId, cleanTaskInfo);

		res.status(200).send({ code: 'UPDATED_TASK', result: null, success: true });

	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

async function deleteTask(req, res) {
	console.log('[deleteTaskInfoController]');

	try {
		// TODO: userSession

		const { taskId } = req.params;

		const foundTask = await taskService.getUserTaskById(taskId);
		if (!foundTask) {
			res.status(404).send({ code: 'TASK_NOT_FOUND', result: null, success: false });
			return;
		}

		await taskService.deleteTask(taskId);
		res.status(200).send({ code: 'DELETED_TASK', result: null, success: true });
	
	} catch (error) {
		console.log(`ERROR = ${JSON.stringify(error)}`);
		res.status(500).send({ code: 'INTERNAL_ERROR', result: error, success: false });
	}
}

module.exports = {
	createNewTask,
	getAllTasks,
	getTaskDetails,
	updateTaskInfo,
	deleteTask
}