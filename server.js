require('dotenv/config');
require('./src/firebaseConfig.js');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userController = require('./src/controllers/userController.js');

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

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});