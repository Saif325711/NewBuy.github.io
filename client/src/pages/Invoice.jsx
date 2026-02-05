import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const Invoice = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="text-center py-10 dark:text-white">Loading Invoice...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!order) return <div className="text-center py-10 dark:text-white">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg print:shadow-none print:w-full dark:bg-gray-800 dark:text-gray-100">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">INVOICE</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">#{order._id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">NewBuy</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            123 E-Commerce St.<br />
                            Tech City, TC 90210<br />
                            support@newbuy.com
                        </p>
                    </div>
                </div>

                {/* Customer & Order Details */}
                <div className="flex justify-between mb-10">
                    <div>
                        <h3 className="text-gray-600 dark:text-gray-300 font-semibold mb-2">Billed To:</h3>
                        <p className="text-gray-800 dark:text-white font-bold">{order.user?.name || 'Customer'}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{order.user?.email}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 font-medium">Shipping Address:</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                            {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-gray-600 dark:text-gray-300 font-semibold mb-2">Order Details:</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">Status:</span> {order.isPaid ? 'Paid' : 'Unpaid'}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm"><span className="font-medium text-gray-700 dark:text-gray-300">Delivered:</span> {order.isDelivered ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                {/* Order Items Table */}
                <div className="mb-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-200">Item</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-200 text-right">Quantity</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-200 text-right">Price</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-200 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300">{item.name}</td>
                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300 text-right">{item.qty}</td>
                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300 text-right">₹{item.price}</td>
                                    <td className="py-3 px-4 text-gray-800 dark:text-gray-300 text-right">₹{(item.qty * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-10">
                    <div className="w-64">
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal</span>
                            <span className="text-gray-800 dark:text-gray-200">₹{order.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Tax</span>
                            <span className="text-gray-800 dark:text-gray-200">₹{order.taxPrice}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Shipping</span>
                            <span className="text-gray-800 dark:text-gray-200">₹{order.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-800 dark:text-white font-bold text-lg">Total</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">₹{order.totalPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Print Button (Hidden while printing) */}
                <div className="text-center print:hidden">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300"
                    >
                        Print Invoice
                    </button>
                    {/* Add back button for better navigation */}
                    <button
                        onClick={() => window.history.back()}
                        className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300"
                    >
                        Back
                    </button>
                </div>

                {/* Footer for Print */}
                <div className="hidden print:block text-center mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Thank you for shopping with NewBuy!</p>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
