const contentModel = require('../models/contentModel');

exports.createContentService = async (newContentInfo) => {
	console.log('[createContentService]');

	try {
		const contentInfo = {
			...newContentInfo,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
		}

		const createdContentId = await contentModel.createDbContent(contentInfo);
		return createdContentId;
		
	} catch (error) {
		throw error;
	}
}

exports.getAllContentsService = async () => {
	console.log('[getAllContentsService]');
	try {
		return await contentModel.getDbContents();
	} catch (error) {
		throw error;
	}
}

exports.getContentByIdService = async (contentId) => {
	console.log('[getContentByIdService]');
	try {
		
	} catch (error) {
		throw error;
	}
}

exports.updateContentService = async (contentId, newContentInfo) => {
	console.log('[updateContentService]');
	try {
		
	} catch (error) {
		throw error;
	}
}

exports.deleteContentService = async (contentId) => {
	console.log('[deleteContentService]');
	try {
		
	} catch (error) {
		throw error;
	}
}