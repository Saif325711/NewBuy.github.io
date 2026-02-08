const dotenv = require('dotenv');
const User = require('../models/User');
// Note: We don't need to connect to DB explicitly if User model handles it via config/db
// But usually we need to load env vars first.

dotenv.config();

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@newbuy.com';
        const adminPassword = 'admin123'; // Change this if you want
        const adminName = 'Super Admin';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit();
        }

        const adminUser = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin' // CRITICAL: This gives admin access
        });

        await adminUser.save();

        console.log('Admin user created successfully!');
        console.log('Email: ' + adminEmail);
        console.log('Password: ' + adminPassword);
        console.log('Password has been securely hashed in the database.');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
