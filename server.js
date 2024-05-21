require('dotenv/config');
require('./src/firebaseConfig');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ErrorHandler = require('./src/middlewares/errorHandler');

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

require('./src/routes')(app);

app.use(ErrorHandler)

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});