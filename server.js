require('dotenv/config');
require('./src/firebaseConfig');

const _DOMAIN = process.env.NODE_ENV === 'production' ? process.env.PROD_DOMAIN : process.env.DEV_DOMAIN;
const _PORT = process.env.NODE_ENV === 'production' ? process.env.PROD_PORT : process.env.DEV_PORT;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const ErrorHandler = require('./src/middlewares/errorHandler');

const app = express();

const corsOptions = {
	// origin: _DOMAIN,
	// credentials: true
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

require('./src/routes')(app);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.use(ErrorHandler)

app.listen(_PORT, () => {
	console.log(`listening on port ${_PORT}`);
});
