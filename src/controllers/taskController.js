const taskModel = require('../models/taskModel');

// resources
const { dueDateValidation, titleValidation, categoryCodeValidation, priorityCodeValidation, statusCodeValidation } = require('../resources/validations');
const { sanitizeString } = require('../resources/sanitization');

// TODO: get from bd
const categories = [];
const priorities = [];
const status = [];

// get from session
const userId = 'Qja9BA2MbDAg0IO2MVj3';

async function createTask(req, res) {
	try {
		console.log('[createTaskController]');

		const { title, description, dueDate, categoryCode, priorityCode, toDoDate } = req.body;

		// TODO: get user session
		// validate user session
		// if user session is not valid, redirect to log in]
		// if session is valid, get userId

		// sanitization
		let cleanTask = {
			title: '',
			description: '',
			dueDate: new Date(),
			categoryCode,
			priorityCode,
			toDoDate: new Date(),
			statusCode: 'NOT_STARTED'
		}

		cleanTask.title = sanitizeString(title);

		if (description.lenght > 0) {
			cleanTask.description = sanitizeString(description);
		};
	
		cleanTask.dueDate = new Date(dueDate); // TODO: handle date https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
		cleanTask.toDoDate = new Date(toDoDate); // TODO: handle date
		cleanTask.categoryCode = sanitizeString(categoryCode);
		cleanTask.priorityCode = sanitizeString(priorityCode); 

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

		if (!categoryCodeValidation(cleanTask.categoryCode)) {
			res.status(400).send({
				code: 'INVALID_CATEGORY_CODE',
				result: null,
				success: false
			});

			return;
		}

		if (!statusCodeValidation(cleanTask.statusCode)) {
			res.status(400).send({
				code: 'INVALID_STATUS_CODE',
				result: null,
				success: false
			});

			return;
		}

		// create task (DB)
		const createdTask = await taskModel.createDbTask(cleanTask, userId);

		console.log(`[createTask] createdTask = ${JSON.stringify(createdTask)}`);

		console.log(`taskInfo = ${JSON.stringify(cleanTask)}`);

		res.status(200).send({
			code: 'CREATED_TASK',
			// result: createdTask,
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