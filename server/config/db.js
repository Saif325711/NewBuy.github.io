const admin = require('firebase-admin');

if (!admin.apps.length) {
    let credential = undefined;

    // 1. Try environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = admin.credential.cert(serviceAccount);
        } catch (e) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT', e);
        }
    }
    // 2. Try local file (dev mode)
    else {
        try {
            const serviceAccount = require('../serviceAccountKey.json');
            credential = admin.credential.cert(serviceAccount);
        } catch (e) {
            // File not found - likely running in Cloud
            console.log('serviceAccountKey.json not found, using default credentials');
        }
    }

    // 3. Initialize with found credential or default (Cloud)
    admin.initializeApp({
        credential: credential || admin.credential.applicationDefault()
    });
}

const db = admin.firestore();

module.exports = db;
