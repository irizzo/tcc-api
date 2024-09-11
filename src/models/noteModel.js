const { db } = require('../firebaseConfig');

const notesCollectionRef = db.collection('notes');

exports.createDbNote = async (noteInfo) => {
	console.log('[createDbNote]');
	const createNoteRes = await notesCollectionRef.add(noteInfo);
	const createdNoteId = createNoteRes.id;
	return createdNoteId;
}

exports.findNoteById = async (noteId) => {
	console.log('[findNoteById] (model)');
	const noteRef = notesCollectionRef.doc(noteId);
	const match = await noteRef.get();

	if (!match.exists) return false;

	return {
		id: match.id,
		...match.data()
	};
}

exports.getUserNotes = async (userId) => {
	console.log('[getUserNotes]');

	const snapshot = await notesCollectionRef.where('userId', '==', userId).get();
	const matchList = [];

	if (snapshot.empty) { return []; }

	snapshot.forEach(doc => {
		matchList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return matchList;
}

exports.updateNote = async (noteId, newInfo) => {
	console.log('[updateNote]');
	const noteRef = notesCollectionRef.doc(noteId);
	const updateRes = await noteRef.update(newInfo);
	return updateRes;
}

exports.deleteNote = async (noteId) => {
	console.log('[deleteNote]');
	const noteRef = notesCollectionRef.doc(noteId);
		const deleteRes = await noteRef.delete();
		return deleteRes;
}