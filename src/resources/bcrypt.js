require('dotenv/config');

const bcrypt = require('bcryptjs');
const salt = process.env.HASH_SALT;

function encryptPlainPass(pass) {
	console.log(`salt = ${salt}`);

	return bcrypt.hashSync(pass, salt);
}

function comparePlainAndHash(plain, hash) {
	return bcrypt.compareSync(plain, hash);
}

module.exports = {
	encryptPlainPass,
	comparePlainAndHash
}