import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Eye, XCircle, CheckCircle, Plus, FileText } from 'lucide-react';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/orders');
            setOrders(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
                <Link to="/orders/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                    <Plus size={20} className="mr-2" />
                    Create Order
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivered</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-4 dark:text-gray-300">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="7" className="text-center py-4 text-red-500">{error}</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 dark:text-gray-300">No orders found</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order._id.substring(0, 10)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {order.user && order.user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order.createdAt.substring(0, 10)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            ${order.totalPrice}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.isPaid ? (
                                                <span className="flex items-center text-green-500 text-sm">
                                                    <CheckCircle size={16} className="mr-1" /> Paid
                                                    <span className="text-xs ml-1 text-gray-400">({order.paidAt?.substring(0, 10)})</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-500 text-sm">
                                                    <XCircle size={16} className="mr-1" /> Not Paid
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.isDelivered ? (
                                                <span className="flex items-center text-green-500 text-sm">
                                                    <CheckCircle size={16} className="mr-1" /> Delivered
                                                    <span className="text-xs ml-1 text-gray-400">({order.deliveredAt?.substring(0, 10)})</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-500 text-sm">
                                                    <XCircle size={16} className="mr-1" /> Not Delivered
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/orders/${order._id}`} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3">
                                                <Eye size={18} />
                                            </Link>
                                            <Link to={`/orders/${order._id}/invoice`} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200" title="View Invoice">
                                                <FileText size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
