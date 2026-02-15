const Settings = require('../models/Settings');

// @desc    Get current settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.get();
        res.json(settings);
    } catch (error) {
        console.error('Get Settings Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { shippingCharge, freeShippingThreshold } = req.body;

        const settings = new Settings({
            shippingCharge: Number(shippingCharge),
            freeShippingThreshold: Number(freeShippingThreshold)
        });

        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error('Update Settings Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getSettings, updateSettings };
