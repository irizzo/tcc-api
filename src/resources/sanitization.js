const xss = require('xss');

// basic sanitization function TODO: replace the other sanitization functions
function generalSanitization(sourceString) {
	console.log(`[generalSanitization] sourceString = ${sourceString}`);
	return xss(sourceString);
};

module.exports = {
	generalSanitization,
};