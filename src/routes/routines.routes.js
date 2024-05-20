/* routine routes
	app.get('/routines', routineController.getUserRoutines);
	app.post('/routines', routineController.createNewRoutine);

	app.get('/routines/:routineId', routineController.getRoutineDetails);
	app.put('/routines/:routineId', routineController.updateRoutineInfo);

*/

const express = require('express')
const router = express.Router()

const routineController = require('../controllers/routineController.js')

router
	.route('/')
	.get(routineController.getUserRoutines) // list all routines
	.post(routineController.createNewRoutine) // create new routine

router
	.route('/:routineId')
	.put(routineController.updateRoutine)

module.exports = router