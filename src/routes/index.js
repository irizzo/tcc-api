const { verifyAccessToken } = require('../middlewares/verifyAccess.js');

module.exports = (app) => {
	app.use('/contents', verifyAccessToken, require('./contents.routes'))
	app.use('/categories', verifyAccessToken, require('./categories.routes'));
	app.use('/events', verifyAccessToken, require('./events.routes'));
	app.use('/notes', verifyAccessToken, require('./notes.routes'))
	app.use('/tasks', verifyAccessToken, require('./tasks.routes'));
	app.use('/user', verifyAccessToken, require('./user.routes'));
	app.use('/user-access', require('./userAccess.routes'));	
}