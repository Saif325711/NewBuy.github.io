const admin = require('firebase-admin');
// Check if running in Cloud Functions
if (process.env.FIREBASE_CONFIG) {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
} else {
    // Local development or non-Google cloud
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : require('../serviceAccountKey.json');

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
}

const db = admin.firestore();

module.exports = db;
