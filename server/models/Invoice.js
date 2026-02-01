const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    customer: {
        name: String,
        email: String,
        address: String,
    },
    items: [
        {
            name: String,
            qty: Number,
            price: Number,
            total: Number,
        }
    ],
    subtotal: Number,
    tax: Number,
    shipping: Number,
    total: Number,
    issuedAt: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Overdue'],
        default: 'Unpaid',
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
