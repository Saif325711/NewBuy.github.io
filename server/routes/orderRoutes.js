const express = require('express');
const router = express.Router();
const { addOrderItems, updateOrderToPaid } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware'); // Commented out for easier testing without login

router.route('/').post(addOrderItems);
router.route('/:id/pay').put(updateOrderToPaid);

module.exports = router;
