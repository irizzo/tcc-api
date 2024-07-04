const express = require('express');
const router = express.Router();

const userAccessController = require('../controllers/userAccessController');
const verifyAccessToken = require('../middlewares/verifyAccessToken.js');

router.route('/verify')
	.all(verifyAccessToken)
	.get(userAccessController.verifyUserAuth)

router.route('/signUp')
	.post(userAccessController.signUp)

router.route('/login')
	.post(userAccessController.login)

router.route('/logout')
	.get(userAccessController.logout)

module.exports = router;
