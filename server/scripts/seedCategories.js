const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Predefined categories
const categories = [
    { name: 'T-Shirt' },
    { name: 'Shirt' },
    { name: 'Baggy Pants' },
    { name: 'Short' },
    { name: 'Panjabi' }
];

async function seedCategories() {
    try {
        console.log('Starting category seed...');

        // Get existing categories
        const existingCategoriesSnapshot = await db.collection('categories').get();
        const existingNames = new Set(existingCategoriesSnapshot.docs.map(doc => doc.data().name));

        // Add only new categories
        for (const category of categories) {
            if (!existingNames.has(category.name)) {
                await db.collection('categories').add({
                    name: category.name,
                    createdAt: new Date().toISOString()
                });
                console.log(`✓ Added category: ${category.name}`);
            } else {
                console.log(`- Category already exists: ${category.name}`);
            }
        }

        console.log('Category seed completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}

seedCategories();
