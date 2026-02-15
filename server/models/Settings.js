const db = require('../config/db');

class Settings {
    constructor(data) {
        this.shippingCharge = data.shippingCharge || 100;
        this.freeShippingThreshold = data.freeShippingThreshold || 1000;
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    static async get() {
        // We only have one settings document, so ID 'global_settings'
        const doc = await db.collection('settings').doc('global_settings').get();
        if (!doc.exists) {
            // Return defaults if not set
            const defaultSettings = new Settings({});
            await defaultSettings.save();
            return defaultSettings;
        }
        return new Settings(doc.data());
    }

    async save() {
        await db.collection('settings').doc('global_settings').set({
            shippingCharge: this.shippingCharge,
            freeShippingThreshold: this.freeShippingThreshold,
            updatedAt: new Date().toISOString()
        });
        return this;
    }
}

module.exports = Settings;
