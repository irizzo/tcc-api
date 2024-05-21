const verifyAccessToken = require('../middlewares/verifyAccessToken.js');

module.exports = (app) => {
	app.use('/categories', verifyAccessToken, require('./categories.routes'));
	app.use('/events', verifyAccessToken, require('./events.routes'));
	app.use('/routines', verifyAccessToken, require('./routines.routes'));
	app.use('/tasks', verifyAccessToken, require('./tasks.routes'));
	app.use('/users', verifyAccessToken, require('./users.routes'));
	app.use('/user-access', require('./userAccess.routes.js'));
	app.use('/test', require('./test.routes.js'));
}