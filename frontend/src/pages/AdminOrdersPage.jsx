import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

                if (!userInfo || userInfo.role !== 'admin') {
                    // For now, if not admin, maybe redirect or show error? 
                    // Ignoring strict check for demo purposes or enforcing it:
                    if (!userInfo) {
                        navigate('/login');
                        return;
                    }
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await axios.get('http://localhost:5000/api/orders', config);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <div className="p-8 text-center text-gray-600">Loading Orders...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">Total Orders: {orders.length}</span>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Order ID</th>
                                    <th scope="col" className="px-6 py-3">User</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Total</th>
                                    <th scope="col" className="px-6 py-3">Paid</th>
                                    <th scope="col" className="px-6 py-3">Delivered</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {order._id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.user && order.user.name ? order.user.name : 'Guest'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            ₹{order.totalPrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isPaid ? (
                                                <span className="text-green-600 font-semibold">Paid</span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">Not Paid</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.isDelivered ? (
                                                <span className="text-green-600 font-semibold">Delivered</span>
                                            ) : (
                                                <span className="text-yellow-600 font-semibold">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/order/${order._id}/invoice`}
                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline mr-4"
                                            >
                                                Invoice
                                            </Link>
                                            <Link
                                                to={`/product/${order._id}`}
                                                className="font-medium text-gray-600 hover:text-gray-800 hover:underline"
                                            >
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
