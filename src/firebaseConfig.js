const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = {
	type: process.env.FBSERV_TYPE ,
	project_id: process.env.FBSERV_PROJECT_ID ,
	private_key_id: process.env.FBSERV_PRIVATE_KEY_ID ,
	private_key: process.env.FBSERV_PRIVATE_KEY ,
	client_email: process.env.FBSERV_CLIENT_EMAIL ,
	client_id: process.env.FBSERV_CLIENT_ID ,
	auth_uri: process.env.FBSERV_AUTH_URI,
	token_uri: process.env.FBSERV_TOKEN_URI ,
	auth_provider_x509_cert_url: process.env.FBSERV_AUTH_PROVIDER ,
	client_x509_cert_url: process.env.FBSERV_CLIENT_CERT ,
	universe_domain: process.env.FBSERV_UNIV_DOMAIN
}

initializeApp({
	credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = { db };