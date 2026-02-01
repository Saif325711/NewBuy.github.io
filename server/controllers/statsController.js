const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        // User count logic is complex in Firestore without aggregation queries enabled or efficient
        // For now fetching all users might be heavy, but let's assume small scale
        const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });

        // For Sales Data (Manual Aggregation)
        const allOrders = await Order.aggregate(); // Returns all order data

        const totalSales = allOrders.reduce((acc, order) => {
            return order.isPaid ? acc + order.totalPrice : acc;
        }, 0);

        // Group by month
        const salesMap = {};
        allOrders.forEach(order => {
            const date = new Date(order.createdAt);
            const month = date.toISOString().slice(0, 7); // YYYY-MM
            if (!salesMap[month]) {
                salesMap[month] = { sales: 0, orders: 0 };
            }
            salesMap[month].sales += order.totalPrice;
            salesMap[month].orders += 1;
        });

        // Convert to array and sort
        const chartData = Object.keys(salesMap).sort().map(key => ({
            name: key,
            sales: salesMap[key].sales,
            orders: salesMap[key].orders
        })).slice(-6); // Last 6 months

        res.json({
            totalOrders,
            totalProducts,
            totalCustomers,
            totalSales,
            salesData: chartData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDashboardStats };
