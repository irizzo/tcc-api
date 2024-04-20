require('dotenv/config');
require('./src/firebaseConfig.js');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userController = require('./src/controllers/userController.js');
const taskController = require('./src/controllers/taskController.js');
const userCategoriesController = require('./src/controllers/userCategoriesController.js');
const eventController = require('./src/controllers/eventController.js');

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// user routes
app.post('/create-user', userController.createUser);
app.post('/login', userController.login);

// task routes
app.post('/create-task', taskController.createTask);

// category routes
app.get('/categories/list', userCategoriesController.getAllCategories);
app.post('/create-category', userCategoriesController.createCategory);

app.get('/categories/:categoryCode', userCategoriesController.getCategoryByCode);
app.put('/categories/:categoryCode', userCategoriesController.updateCategory);
app.delete('/categories/:categoryCode', userCategoriesController.deleteCategory);

// event routes
app.get('/events/list', eventController.getAllEvents);
app.post('/create-event', eventController.createEvent);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});