const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'user';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    static async findOne(criteria) {
        // Only supporting email search for now
        if (!criteria.email) throw new Error('Unsupported criteria');

        const snapshot = await db.collection('users').where('email', '==', criteria.email).limit(1).get();
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const user = doc.data();
        user._id = doc.id; // Map doc ID to _id for compatibility

        // Attach matchPassword method to the object instance
        user.matchPassword = async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        };

        return user;
    }

    static async findAll() {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        return users;
    }

    static async findById(id) {
        const doc = await db.collection('users').doc(id).get();
        if (!doc.exists) return null;
        const user = doc.data();
        user._id = doc.id;
        return user;
    }

    async save() {
        // Hash password if it's new (simple check)
        // In a real app, we'd check if modified. Here we assume save() is called on creation.
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        const res = await db.collection('users').add({
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            createdAt: this.createdAt
        });
        this._id = res.id;
        return this;
    }

    // Helper for counting (used in dashboard)
    static async countDocuments(query = {}) {
        // Firestore count is expensive/different, for now getting all metadata
        // Optimally use aggregation queries
        let ref = db.collection('users');
        if (query.role && query.role.$ne) {
            // Firestore != is not directly supported in simple queries easily without indexes
            // For 'admin' check, we can just fetch all and filter or ignore for MVP
        }
        const snapshot = await ref.get();
        if (query.role && query.role.$ne) {
            return snapshot.docs.filter(d => d.data().role !== query.role.$ne).length;
        }
        return snapshot.size;
    }
}

module.exports = User;
