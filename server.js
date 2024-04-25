require('dotenv/config');
require('./src/firebaseConfig');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userController = require('./src/controllers/userController');
const taskController = require('./src/controllers/taskController');
const userCategoriesController = require('./src/controllers/userCategoriesController');
const eventController = require('./src/controllers/eventController');
const routineController = require('./src/controllers/routineController')

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// user routes
app.post('/create-user', userController.createNewUser);
app.post('/login', userController.userLogin);

// task routes
app.get('/tasks', taskController.getAllTasks); // list all tasks
app.post('/tasks', taskController.createNewTask);

app.get('/tasks/:taskId', taskController.getTaskDetails); // task details
app.put('/tasks/:taskId', taskController.updateTaskInfo); // update an existing task's details
app.delete('/tasks/:taskId', taskController.deleteTask) // detele an existing task

// category routes
app.get('/categories', userCategoriesController.getAllCategories); // list all categories
app.post('/categories', userCategoriesController.createNewCategory); // create new category

app.get('/categories/:categoryCode', userCategoriesController.getCategoryByCode); // get category details 
app.put('/categories/:categoryCode', userCategoriesController.updateCategory);
app.delete('/categories/:categoryCode', userCategoriesController.deleteCategory);

// event routes
app.get('/events', eventController.getUserEvents); // list all events
app.post('/events', eventController.createNewEvent); // create new event

app.put('/events/:eventId', eventController.updateEvent);
app.delete('/events/:eventId', eventController.deleteEvent);

app.put('/events/:eventId/update-dates', eventController.updateEventDates);

// routine routes
app.get('/routines', routineController.getUserRoutines);
app.post('/routines', routineController.createNewRoutine);

app.get('/routines/:routineId', routineController.getRoutineDetails);
app.put('/routines/:routineId', routineController.updateRoutineInfo);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});