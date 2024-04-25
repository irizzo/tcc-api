const { db } = require('../firebaseConfig');

const routinesCollectionRef = db.collection('routines');

exports.createDbRoutine = async (routineInfo) => {
	console.log('[createDbRoutine]');

	const createdRoutineRes = await routinesCollectionRef.add(routineInfo);
	const createdRoutineId = createdRoutineRes.id;

	return createdRoutineId
}

exports.getUserDbRoutines = async (userId) => {
	console.log('getUserDbRoutines');

	const snapshot = await routinesCollectionRef.where('userId', '==', userId).get();
	const matchList = [];

	if (snapshot.empty) return []

	snapshot.forEach(doc => {
		matchList.push({
			id: doc.id,
			... doc.data()
		})
	})

	return matchList;
}

exports.findDbRoutineById = async (routineId) => {
	console.log('[findDbRoutineById]');
	const routineRef = routinesCollectionRef.doc(routineId);
	const match = await routineRef.get();

	if (!match.exists) {
		return false;
	}

	return match;
}

exports.updateDbRoutine = async (routineId, updatedInfo) => {
	console.log('[updateDbRoutine]');
	const routineRef = routinesCollectionRef.doc(routineId);
	const updateRes = await routineRef.update(updatedInfo);
	return updateRes;
}

exports.deleteDbRoutine = async (routineId) => {
	console.log('[deleteDbRoutine]');
	const routineRef = routinesCollectionRef.doc(routineId);
	const deleteRes = await routineRef.delete();
	return deleteRes;
}