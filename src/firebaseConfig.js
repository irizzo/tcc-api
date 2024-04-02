const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./personal-organizer_firebaseCredentials.json');
initializeApp({
	credential: cert(serviceAccount)
});

const db = getFirestore();

async function testing() {
	const docRef = db.collection('users').doc('alovelace');
	
	await docRef.set({
		first: 'Ada',
		last: 'Lovelace',
		born: 1815
	});
}

testing();

module.exports = { db };