/* task routes
	app.get('/tasks', taskController.getAllTasks); // list all tasks
	app.post('/tasks', taskController.createNewTask);

	app.get('/tasks/:taskId', taskController.getTaskDetails); // task details
	app.put('/tasks/:taskId', taskController.updateTaskInfo); // update an existing task's details
	app.delete('/tasks/:taskId', taskController.deleteTask) // detele an existing task
*/

const express = require('express')
const router = express.Router()

const taskController = require('../controllers/taskController.js')

router
	.route('/')
	.get(taskController.getUserTasks) // list all tasks
	.post(taskController.createNewTask) // create new task

router
	.route('/:taskId')
	.get(taskController.getTaskDetails)
	.put(taskController.updateTask)
	.delete(taskController.deleteTask)

module.exports = router