const dotenv = require('dotenv');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

const resetPassword = async () => {
    try {
        console.log('Starting password reset...');

        // Target emails
        const emails = ['saifulislam786452@gmail.com', 'admin@newbuy.com'];
        const newPasswordPlain = '123456';

        // Generate hash manually here to ensure it's correct
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPasswordPlain, salt);

        for (const email of emails) {
            console.log(`Checking for user: ${email}`);
            try {
                const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
                console.log(`Query successful. Empty? ${snapshot.empty}`);

                if (snapshot.empty) {
                    console.log(`User ${email} not found. Creating it...`);
                    await db.collection('users').add({
                        name: 'Admin User',
                        email: email,
                        password: hashedPassword,
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    });
                    console.log(`Created admin user: ${email}`);
                } else {
                    const doc = snapshot.docs[0];
                    console.log(`Found user ${doc.id}, updating...`);
                    await db.collection('users').doc(doc.id).update({
                        password: hashedPassword,
                        role: 'admin' // Ensure they are admin
                    });
                    console.log(`Updated password for: ${email}`);
                }
            } catch (err) {
                console.error(`Operation failed for ${email}:`, err);
            }
        }

        console.log('------------------------------------------------');
        console.log('SUCCESS: Admin password has been reset to: 123456');
        console.log('------------------------------------------------');
        process.exit();
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
};

resetPassword();
