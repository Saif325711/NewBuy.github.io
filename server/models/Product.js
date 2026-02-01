const db = require('../config/db');

class Product {
    constructor(data) {
        Object.assign(this, data);
    }

    static async find(query = {}) {
        // Basic implementation for pagination support
        // const pageSize = 10;
        // const page = 1;
        // Firestore pagination requires cursors, simplifying for MVP to fetch all

        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

        // In-memory filter/search if needed (for small datasets)
        if (query.keyword) {
            const regex = new RegExp(query.keyword, 'i');
            return products.filter(p => regex.test(p.name));
        }

        return products;
    }

    static async findById(id) {
        const doc = await db.collection('products').doc(id).get();
        if (!doc.exists) return null;
        return { _id: doc.id, ...doc.data() };
    }

    static async create(data) {
        const res = await db.collection('products').add({
            ...data,
            createdAt: new Date().toISOString()
        });
        return { _id: res.id, ...data };
    }

    static async findByIdAndUpdate(id, data) {
        await db.collection('products').doc(id).update(data);
        return { _id: id, ...data };
    }

    static async findByIdAndDelete(id) {
        await db.collection('products').doc(id).delete();
        return true;
    }

    static async countDocuments() {
        const snapshot = await db.collection('products').count().get();
        return snapshot.data().count;
    }
}

module.exports = Product;
