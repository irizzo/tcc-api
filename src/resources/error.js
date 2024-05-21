/** Create error function
 * 
 * @param {String} message 
 * @param {Number} statusCode 
 * @returns {Error} 
 */

const CustomError = (errorCode, statusCode) => {
	const e = new Error();
	e.errorCode = errorCode;
	e.statusCode = statusCode;
	return e;
}

module.exports = CustomError;
