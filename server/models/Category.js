const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null, // If null, it's a root category
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

categorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
});

module.exports = mongoose.model('Category', categorySchema);
