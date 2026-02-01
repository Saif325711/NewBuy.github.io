const db = require('../config/db');

class Order {
    constructor(data) {
        Object.assign(this, data);
    }

    static async find() {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = await Promise.all(snapshot.docs.map(async doc => {
            const orderData = doc.data();
            let user = null;
            if (orderData.user) {
                const userDoc = await db.collection('users').doc(orderData.user).get();
                if (userDoc.exists) user = { _id: userDoc.id, name: userDoc.data().name, email: userDoc.data().email };
            }
            return { _id: doc.id, ...orderData, user };
        }));
        return orders;
    }

    static async findById(id) {
        const doc = await db.collection('orders').doc(id).get();
        if (!doc.exists) return null;

        const orderData = doc.data();
        let user = null;
        if (orderData.user) {
            const userDoc = await db.collection('users').doc(orderData.user).get();
            if (userDoc.exists) user = { _id: userDoc.id, name: userDoc.data().name, email: userDoc.data().email };
        }
        const order = new Order({ _id: doc.id, ...orderData, user });
        return order;
    }

    static async create(data) {
        const res = await db.collection('orders').add({
            ...data,
            createdAt: new Date().toISOString()
        });
        return { _id: res.id, ...data };
    }

    async save() {
        if (this._id) {
            const { _id, user, ...dataToSave } = this;
            // Ensure user is stored as ID string if it's an object
            if (typeof this.user === 'object' && this.user._id) {
                dataToSave.user = this.user._id;
            } else {
                dataToSave.user = this.user;
            }

            await db.collection('orders').doc(this._id).update(dataToSave);
            return this;
        } else {
            // Should be covered by create, but just in case
            const res = await db.collection('orders').add(this);
            this._id = res.id;
            return this;
        }
    }

    static async countDocuments() {
        const snapshot = await db.collection('orders').count().get();
        return snapshot.data().count;
    }

    static async aggregate(pipeline) {
        const snapshot = await db.collection('orders').get();
        const orders = snapshot.docs.map(d => d.data());
        return orders;
    }
}

module.exports = Order;
