/* event routes
	app.get('/events', eventController.getUserEvents); // list all events
	app.post('/events', eventController.createNewEvent); // create new event

	app.put('/events/:eventId', eventController.updateEvent);
	app.delete('/events/:eventId', eventController.deleteEvent);

	app.put('/events/:eventId/update-dates', eventController.updateEventDates);
*/

const express = require('express')
const router = express.Router()

const eventController = require('../controllers/eventController.js')

router
	.route('/')
	.get(eventController.getUserEvents) // list all events
	.post(eventController.createNewEvent) // create new event

router
	.route('/:eventId')
	.get(eventController.getEventInfo)
	.put(eventController.updateEvent)
	.delete(eventController.deleteEvent)

module.exports = router
