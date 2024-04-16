const taskModel = require('../models/taskModel');

// resources
const { dueDateValidation, titleValidation, categoryCodeValidation, priorityCodeValidation, statusCodeValidation } = require('../resources/validations');
const { sanitizeString } = require('../resources/sanitization');

const categories = [];
const priorities = [];
const status = [];

async function createTask(req, res) {
	try {
		console.log('[createTaskController]');

		const { title, description, dueDate, categoryCode, priorityCode, toDoDate } = req.body;

		// get user session
		const { userId } = req.session;

		// validate user session

		// if user session is not valid, redirect to log in

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

		cleanTask.dueDate = dueDate; // TODO: sanitize date
		cleanTask.toDoDate = toDoDate; // TODO: sanitize date
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

		if (!dueDateValidation(cleanTodo.dueDate)) {
			res.status(400).send({
				code: 'INVALID_DUE_DATE',
				result: null,
				success: false
			});

			return;
		}

		if (!dueDateValidation(cleanTodo.toDoDate)) {
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
		const createdTask = await todoModel.createDbTask(cleanTask);

		console.log(`[createTask] createdTask = ${JSON.stringify(createdTask)}`);

		res.status(200).send({
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