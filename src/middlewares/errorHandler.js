async function errorHandler(err, req, res, next) {
	console.log('Middleware Error Handling');
	console.log(`Middleware Error Handling err = ${JSON.stringify(err)}`);
	console.log(`Middleware Error Handling err = ${err}`);

	const errStatus = err.statusCode || 500;
	const errCode = err.errorCode || 'INTERNAL_ERROR';

	res.status(errStatus).json({
		success: false,
		status: errStatus,
		code: errCode,
		stack: process.env.NODE_ENV === 'development' ? err.stack : {}
	})
}

module.exports = errorHandler;
