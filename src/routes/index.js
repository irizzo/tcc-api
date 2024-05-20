module.exports = (app) => {
	app.use('/categories', require('./categories.routes'));
	app.use('/events', require('./events.routes'));
	app.use('/routines', require('./routines.routes'));
	app.use('/tasks', require('./tasks.routes'));
	app.use('/users', require('./users.routes'));
}