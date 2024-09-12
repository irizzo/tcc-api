const { db } = require('../firebaseConfig');

const contentsCollectionRef = db.collection('contents');

exports.createDbContent = async (contentInfo) => {
	console.log('[createDbContent]');
	const createContentRes = await contentsCollectionRef.add(contentInfo);
	const createdContentId = createContentRes.id;
	return createdContentId;
}

exports.getDbContents = async () => {
	console.log('[getDbContents]');

	const snapshot = await contentsCollectionRef.get();
	const contentsList = [];

	if (snapshot.empty) {
		return []
	}

	snapshot.forEach(doc => {
		contentsList.push({
			id: doc.id,
			...doc.data()
		});
	});

	return contentsList;
}

exports.findDbContentById = async (contentId) => {
	console.log('[findContentById]');

	const contentRef = contentsCollectionRef.doc(contentId);
	const match = await contentRef.get();

	if (!match.exists) {
		return false;
	}

	return {
		id: match.id,
		...match.data()
	};
}

exports.updateDbContent = async (contentId, newInfo) => {
	console.log('[updateDbContent]');
	const contentRef = contentsCollectionRef.doc(contentId);
	const updateRes = await contentRef.update(newInfo);
	return updateRes;
}

exports.deleteDbContent = async (contentId) => {
	console.log('[deleteDbContent]');
	const contentRef = contentsCollectionRef.doc(contentId);
	const deleteRes = await contentRef.delete();
	return deleteRes;
}