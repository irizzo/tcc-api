const taskModel = require('../models/taskModel');

// resources
const { dueDateValidation, titleValidation, categoryCodeValidation, priorityCodeValidation, statusCodeValidation } = require('../resources/validations');
const { sanitizeString, sanitizeCodeString } = require('../resources/sanitization');

// TODO: get from user session
const userId = "stQM4UlD6n6c6h9Lmi7w";

async function createTask(req, res) {
	try {
		console.log('[createTaskController]');

		const { title, description, dueDate, categoryCode, priorityCode, toDoDate } = req.body;

		// TODO: get user session
		// validate user session
		// if user session is not valid, redirect to log in
		// if session is valid, get userId

		// sanitization
		const cleanTask = {
			statusCode: 'NOT_STARTED'
		}

		cleanTask.title = sanitizeString(title);

		// TODO: remove condition (leave only on validation)
		if (description.length > 0) {
			cleanTask.description = sanitizeString(description);
		};
		
		// TODO: handle date https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
		cleanTask.dueDate = new Date(dueDate); 
		cleanTask.toDoDate = new Date(toDoDate);

		// TODO: remove condition (leave only on validation)
		if (categoryCode?.length > 0) {
			cleanTask.categoryCode = sanitizeCodeString(categoryCode);
		};

		// TODO: remove condition (leave only on validation)
		if (priorityCode?.length > 0) {
			cleanTask.priorityCode = sanitizeCodeString(priorityCode);
		};

		// validation
		if (!titleValidation(cleanTask.title)) {
			res.status(400).send({
				code: 'INVALID_TITLE',
				result: null,
				success: false
			});

			return;
		}

		if (!dueDateValidation(cleanTask.dueDate)) {
			res.status(400).send({
				code: 'INVALID_DUE_DATE',
				result: null,
				success: false
			});

			return;
		}

		if (!dueDateValidation(cleanTask.toDoDate)) {
			res.status(400).send({
				code: 'INVALID_DUE_DATE',
				result: null,
				success: false
			});

			return;
		}
		
		if (!priorityCodeValidation(cleanTask.priorityCode)) {
			res.status(400).send({
				code: 'INVALID_PRIORITY_CODE',
				result: null,
				success: false
			});

			return;
		}
		
		// TODO: Category validation
		if (!categoryCodeValidation(cleanTask.categoryCode)) {
			res.category(400).send({
				code: 'INVALID_CATEGORY_CODE',
				result: null,
				success: false
			});

			return;
		}

		// create task (DB)
		const createdTask = await taskModel.createDbTask(cleanTask, userId);

		console.log(`[createTask] createdTask = ${JSON.stringify(createdTask)}`);

		console.log(`taskInfo = ${JSON.stringify(cleanTask)}`);

		res.status(201).send({
			code: 'CREATED_TASK',
			result: createdTask,
			success: true
		});

	} catch (error) {
		console.log(`ERROR: ${error}`);
		res.status(500).send({
			code: 'INTERNAL_ERROR',
			result: error,
			success: false
		});
	}
}

module.exports = {
	createTask
}