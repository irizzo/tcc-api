const express = require('express')
const router = express.Router()

const noteController = require('../controllers/noteController');

router
	.route('/')
	.get(noteController.getUserNotes)
	.post(noteController.createNewNote)

router
	.route('/:noteId')
	.put(noteController.updateNote)
	.delete(noteController.deleteNote)

module.exports = router;