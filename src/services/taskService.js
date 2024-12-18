const taskModel = require('../models/taskModel');
const { formatDatesInArray, convertStampToDate } = require('../resources/dates.helpers');

async function createNewTask(userId, newTaskInfo) {
	console.log('[createNewTask] (service)');
	try {
		const taskInfo = { 
			...newTaskInfo, 
			statusCode: 'NOT_STARTED', 
			createdAt: new Date(),
			updatedAt: new Date(),
			userId
		};

		const createdTaskId = await taskModel.createDbTask(taskInfo);

		return createdTaskId;
	} catch (error) {
		console.log(`(service) error = ${error} `);
		throw error;
	}
}

async function getUserTasks(userId) {
	console.log('[getUserTasks] (service)');
	try {
		const tasksList = await taskModel.getUserTasks(userId);

		if (!tasksList || tasksList.length === 0) {
			console.log('taskList vazia');

			return [];
		}

		return tasksList;
		
	} catch (error) {
		throw error;
	}
}

async function getUserTaskById(taskId) {
	console.log('[getUserTaskById] (service)');
	try {
		const match = await taskModel.findTaskById(taskId);

		console.log('[getUserTaskById] match: ', match);

		if(!match) {
			return false
		}
		
		return match;

	} catch (error) {
		throw error;
	}
}

async function updateTaskInfo(taskId, newInfo) {
	console.log('[updateTaskInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: new Date() };
		await taskModel.updateTask(taskId, updatedInfo);
		return;

	} catch (error) {
		console.log('[updateTaskInfo] error: ', error);
		throw error;
	}
}

async function deleteTask(taskId) {
	console.log('[deleteTask](service)');
	try {
		await taskModel.deleteTask(taskId);
		return;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createNewTask,
	getUserTasks,
	getUserTaskById,
	updateTaskInfo,
	deleteTask
}
