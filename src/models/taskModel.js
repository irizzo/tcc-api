const { db } = require('../firebaseConfig');

const tasksCollectionRef = db.collection('tasks');

// Criar uma tarefa
async function createDbTask(task, userId) {
	console.log('[createDbTask]');

	const taskRef = await tasksCollectionRef.add({ ...task, userId }); 
	const createdTaskId = taskRef.id;

	return createdTaskId;
}

// Recuperar tarefas de um usuário
async function getUserTasks(userId) {
	console.log('[getUserTasks]');

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

// Recuperar uma tarefa por id

module.exports = {
	createDbTask,
	getUserTasks
}