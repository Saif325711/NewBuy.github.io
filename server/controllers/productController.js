const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? { keyword: req.query.keyword }
            : {};

        const count = await Product.countDocuments(); // Simple count
        const productsAll = await Product.find(keyword); // Find with keyword filtering in-memory

        // Simple manual pagination
        const startIndex = (page - 1) * pageSize;
        const products = productsAll.slice(startIndex, startIndex + pageSize);

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            purchasePrice,
            description,
            image,
            category,
            subCategory,
            brand,
            weight,
            countInStock,
            sku,
            variants, // Array of objects
            colors,   // Array of strings
            status
        } = req.body;

        const productData = {
            name,
            price,
            purchasePrice,
            user: req.user._id,
            image,
            category,
            subCategory,
            brand,
            weight,
            quantity: countInStock || 0,
            sku,
            description,
            variants: variants || [],
            colors: colors || [],
            status: status || 'Active'
        };

        const createdProduct = await Product.create(productData);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            purchasePrice,
            description,
            image,
            category,
            subCategory,
            brand,
            weight,
            countInStock,
            sku,
            variants,
            colors,
            status
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            const updatedData = {
                name: name || product.name,
                price: price || product.price,
                purchasePrice: purchasePrice || product.purchasePrice,
                description: description || product.description,
                image: image || product.image, // Fix image field name consistency
                category: category || product.category,
                subCategory: subCategory || product.subCategory,
                brand: brand || product.brand,
                weight: weight || product.weight,
                quantity: countInStock !== undefined ? countInStock : product.quantity,
                sku: sku || product.sku,
                variants: variants || product.variants,
                colors: colors || product.colors,
                status: status || product.status
            };

            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
