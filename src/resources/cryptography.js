const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

function encrypt(s) {
	return encripted = bcrypt.hashSync(s, salt);
}

function compare(s, encripted) {
	console.log(`s = ${s}`);
	console.log(`encripted = ${encripted}`);
	
	return bcrypt.compareSync(s, encripted);
}

module.exports = {
	encrypt,
	compare
}
