const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
// Assume protect and admin middleware are available in ../middleware/authMiddleware
// Checking authRoutes or index.js to confirm middleware location
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getSettings).put(protect, admin, updateSettings);

module.exports = router;
