const dotenv = require('dotenv');
const User = require('./models/User');
// Initialize DB by requiring it, so firebase-admin starts
const db = require('./config/db');

dotenv.config();

const importData = async () => {
    try {
        console.log('Seeding process started...');
        const email = 'saifulislam786452@gmail.com';

        // Check if exists
        const user = await User.findOne({ email });

        if (user) {
            console.log('User already exists. Updating...');
            // In Firestore, we need the doc ID to update. findOne returns object with _id
            // But our Model save() is built for new instances mostly or we need to manually update
            const dbInstance = require('./config/db');
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('987654321', salt);

            await dbInstance.collection('users').doc(user._id).update({
                name: 'saiful islam',
                role: 'admin',
                password: hashedPassword
            });
            console.log('User updated.');
        } else {
            console.log('Creating new admin user...');
            const newUser = new User({
                name: 'saiful islam',
                email: email,
                password: '987654321',
                role: 'admin'
            });
            await newUser.save();
            console.log('User created.');
        }

        console.log('Admin User Set Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
