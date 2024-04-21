const { db } = require('../firebaseConfig');

const tasksCollectionRef = db.collection('tasks');

// Criar uma tarefa
async function createDbTask(taskInfo) {
	console.log('[createDbTask] (model)');

	const taskRef = await tasksCollectionRef.add(taskInfo); 
	const createdTaskId = taskRef.id;

	return createdTaskId;
}

// Recuperar tarefas de um usuário
async function getUserTasks(userId) {
	console.log('[getUserTasks] (model)');

	const snapshot = await tasksCollectionRef.where('userId', '==', userId).get();
	const matchList = [];

	if (snapshot.empty) {
		console.log('No tasks found');
		return [];
	}

	snapshot.forEach(doc => {
		matchList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return matchList;
}

async function findTaskById(taskId) {
	console.log('[findTaskById] (model)');

	const taskRef = tasksCollectionRef.doc(taskId);
	const match = await taskRef.get();

	if (!match.exists) {
		return false;
	}

	return match;
}

async function updateTask(taskId, newInfo) {
	console.log('[updateTask] (model)');
	const taskRef = tasksCollectionRef.doc(taskId);
	const updateRes = await taskRef.update(newInfo);
	return updateRes;
}

async function deleteTask(taskId) {
	console.log('[deleteTask] (model)');
	const taskRef = tasksCollectionRef.doc(taskId);
	const deleteRes = await taskRef.delete();
	return deleteRes;
}


module.exports = {
	createDbTask,
	getUserTasks,
	findTaskById,
	updateTask,
	deleteTask
}