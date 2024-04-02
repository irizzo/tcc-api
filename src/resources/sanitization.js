// basic sanitization function
function sanitizeString(sourceString) {
	// console.log(`[sanitizeString] sourceString = ${sourceString}`);

	const cleanString = sourceString.trim().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	return cleanString;
};

function sanitizeEmail(sourceEmail) {
	// console.log(`[sanitizeEmail] sourceEmail = ${sourceEmail}`);

	const cleanEmail = sourceEmail.trim().replace(/[`~!#$%^&*()|\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
	return cleanEmail;
}

module.exports = {
	sanitizeString,
	sanitizeEmail
};