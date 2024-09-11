const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController.js')

router.route('/')
	.get(userController.getUserInfo)
	.put(userController.updateUser)
	.delete(userController.deleteUser)

module.exports = router
