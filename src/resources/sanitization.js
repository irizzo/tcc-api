const xss = require('xss');

// basic sanitization function TODO: replace the other sanitization functions
function generalSanitization(sourceString) {
	return xss(sourceString);
};

module.exports = {
	generalSanitization,
};