const Order = require('../models/Order');
const Razorpay = require('razorpay');

// Initialize Razorpay
// Ensure keys are strings before trimming to avoid crash if undefined
const key_id = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : '';
const key_secret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : '';

const razorpay = new Razorpay({
    key_id,
    key_secret,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (for now) / Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = await Order.create({
            orderItems,
            user: req.user ? req.user._id : 'Guest',
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: false,
            isDelivered: false,
        });

        // Razorpay Order Creation
        const payment_capture = 1;
        const currency = 'INR';
        const options = {
            amount: Math.round(totalPrice * 100), // Amount in paise
            currency,
            receipt: `${order._id}`,
            payment_capture,
        };

        try {
            console.log('Creating Razorpay Order with Key:', key_id);
            const response = await razorpay.orders.create(options);
            console.log('Razorpay Order Created:', response.id);

            res.status(201).json({
                ...order,
                razorpayOrderId: response.id,
                razorpayKeyId: key_id
            });
        } catch (error) {
            console.error("Razorpay Error:", error);
            // Fallback for simulation/testing if keys are missing
            res.status(201).json({
                ...order,
                razorpayOrderId: 'order_SIMULATED_' + Date.now()
            });
        }
    }
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Get Order By ID Failed:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        console.log(`Updating Order ${req.params.id} to Paid`);
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            console.log('Order Updated Successfully');
            res.json(updatedOrder);
        } else {
            console.error('Order Not Found');
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Update Order Failed:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
};
