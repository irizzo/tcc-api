const { db } = require('../firebaseConfig');

const routinesCollectionRef = db.collection('routines');

exports.createDbActivity = async (routineId, activityInfo) => {
	console.log('[createDbRoutine]');
	const activityRef = await routinesCollectionRef.doc(routineId).collection('activities').add(activityInfo)
	const createdActivityId = activityRef.id;

	return createdActivityId;
}

exports.getActivitiesOfRoutine = async (routineId) => {
	console.log('[getActivitiesOfRoutine] (model)');

	const  activitiesList = [];

	const snapshot = await routinesCollectionRef.doc(userId).collection('activities').get();

	snapshot.forEach(doc => {
		activitiesList.push(doc.data());
	});

	return activitiesList;
}