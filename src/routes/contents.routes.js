const express = require('express');
const router = express.Router();

const contentController = require('../controllers/contentController');
const { checkAdminAuth } = require('../middlewares/verifyAccess.js');

router.route('/')
	.get(contentController.getAllContents)

router.route('/admin')
	.all(checkAdminAuth)
	.post(contentController.createNewContent)

router.route('/admin/:contentId')
	.all(checkAdminAuth)
	.put(contentController.updateContent)
	.delete(contentController.deleteContent)

module.exports = router;