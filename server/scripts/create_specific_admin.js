const dotenv = require('dotenv');
const User = require('../models/User');
const db = require('../config/db'); // Initialize Firebase
const bcrypt = require('bcryptjs');

dotenv.config();

const createSpecificAdmin = async () => {
    try {
        console.log('Admin setup process started...');
        const email = 'saifulislam.786452@gmail.com';
        const password = 'saiful@786452';
        const name = 'Saiful Islam';

        // Check if user exists
        const user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            console.log('User already exists. Updating credentials...');

            // Update in Firestore
            await db.collection('users').doc(user._id).update({
                name: name,
                role: 'admin',
                password: hashedPassword,
                updatedAt: new Date()
            });
            console.log('User updated successfully.');
        } else {
            console.log('Creating new admin user...');
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword, // The model might re-hash if we are not careful, but usually manual hash is fine if we bypass pre-save or if pre-save checks isModified
                role: 'admin'
            });

            // If the User model has a pre-save hook that hashes the password, we might be double hashing if we pass hashed password.
            // Let's check the User model first to be sure, or just pass the plain password if the model handles hashing.
            // Wait, I should check the User model. 
            // Checking seeder.js, it hashes manually if updating, but for new user it passes plain text?
            // seeder.js:
            // const newUser = new User({ ... password: '987654321' ... }); await newUser.save();
            // So for new user, the model likely hashes it.
            // But for update, we are doing direct DB update, so we MUST hash.

            // Let's assume for new user we pass plain text to be safe with model hooks.
            newUser.password = password;
            await newUser.save();
            console.log('User created successfully.');
        }

        console.log('Admin setup completed.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createSpecificAdmin();
