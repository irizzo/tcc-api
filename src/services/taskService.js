const taskModel = require('../models/taskModel');

async function createNewTask(userId, newTaskInfo) {
	console.log('[createNewTask] (service)');
	try {
		const taskInfo = { 
			...newTaskInfo, 
			statusCode: 'NOT_STARTED', 
			createdAt:  new Date(Date.now()),
			updatedAt:  new Date(Date.now()),
			userId
		};

		const createdTaskId = await taskModel.createDbTask(taskInfo);
		// TODO: addTaskRef await userModel.addTaskRef(userId, createdTaskId); 

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
		return tasksList;

	} catch (error) {
		throw error;
	}
}

async function getUserTaskById(taskId) {
	console.log('[getUserTaskById] (service)');
	try {
		const match = await taskModel.findTaskById(taskId);
		return match;

	} catch (error) {
		throw error;
	}
}

async function updateTaskInfo(taskId, newInfo) {
	console.log('[updateTaskInfo] (service)');
	try {
		const updatedInfo = { ...newInfo, updatedAt: new Date(Date.now()) };
		await taskModel.updateTask(taskId, updatedInfo);
		return;

	} catch (error) {
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