try {
    console.log('Requiring authController...');
    const authController = require('./controllers/authController');
    console.log('Successfully required authController');
    console.log('Exports:', Object.keys(authController));
} catch (error) {
    console.error('Error requiring authController:', error.stack);
}
