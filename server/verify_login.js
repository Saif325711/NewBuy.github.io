const User = require('./models/User');
// const db = require('./config/db'); // User model requires db internally
const dotenv = require('dotenv');

dotenv.config();

const verifyLogin = async () => {
    try {
        console.log('Verifying login...');
        const email = 'saifulislam786452@gmail.com';
        const password = '987654321';

        console.log(`Checking user: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User NOT FOUND in DB');
            return;
        }

        console.log('User found.');
        console.log('Hashed Password in DB:', user.password);

        const isMatch = await user.matchPassword(password);
        console.log(`Password '987654321' match result: ${isMatch}`);

        if (isMatch) {
            console.log('LOGIN SUCCESS (Logic Verified)');
        } else {
            console.log('LOGIN FAILED (Password Mismatch)');

            // Debug: Try re-hashing
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(password, salt);
            console.log('New Hash would be Example:', newHash);
            console.log('Compare check:', await bcrypt.compare(password, newHash));
        }
        process.exit();

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyLogin();
