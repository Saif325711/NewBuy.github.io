const db = require('../config/db');

class Category {
    constructor(data) {
        Object.assign(this, data);
    }

    static async find() {
        const snapshot = await db.collection('categories').get();
        return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    }

    static async create(data) {
        const res = await db.collection('categories').add({
            ...data,
            createdAt: new Date().toISOString()
        });
        return { _id: res.id, ...data };
    }

    static async delete(id) {
        await db.collection('categories').doc(id).delete();
        return true;
    }
}

module.exports = Category;
