const express = require('express');
const router = express.Router();

const userAccessController = require('../controllers/userAccessController');

router.route('/')
	.get(userAccessController.verifyAuthCookie)

router.route('/signUp')
	.post(userAccessController.singUp)

router.route('/login')
	.post(userAccessController.login)

router.route('/logout')
	.get(userAccessController.logout)

module.exports = router;