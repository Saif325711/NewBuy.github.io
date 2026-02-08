import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InvoicePage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                };

                // Adjust URL if needed based on your backend structure
                const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
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

    if (loading) return <div className="text-center py-10">Loading Invoice...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!order) return <div className="text-center py-10">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg print:shadow-none print:w-full">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                        <p className="text-gray-500 mt-1">#{order._id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-gray-700">NewBuy</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            123 E-Commerce St.<br />
                            Tech City, TC 90210<br />
                            saifulislam.786452@gmail.com
                        </p>
                    </div>
                </div>

                {/* Customer & Order Details */}
                <div className="flex justify-between mb-10">
                    <div>
                        <h3 className="text-gray-600 font-semibold mb-2">Billed To:</h3>
                        <p className="text-gray-800 font-bold">{order.user?.name || 'Customer'}</p>
                        <p className="text-gray-600 text-sm">{order.user?.email}</p>
                        <p className="text-gray-600 text-sm mt-2 font-medium">Shipping Address:</p>
                        <p className="text-gray-600 text-sm">
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                            {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-gray-600 font-semibold mb-2">Order Details:</h3>
                        <p className="text-gray-600 text-sm"><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-sm"><span className="font-medium">Status:</span> {order.isPaid ? 'Paid' : 'Unpaid'}</p>
                        <p className="text-gray-600 text-sm"><span className="font-medium">Delivered:</span> {order.isDelivered ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                {/* Order Items Table */}
                <div className="mb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Item</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Quantity</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Price</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-gray-800">{item.name}</td>
                                    <td className="py-3 px-4 text-gray-800 text-right">{item.qty}</td>
                                    <td className="py-3 px-4 text-gray-800 text-right">₹{item.price}</td>
                                    <td className="py-3 px-4 text-gray-800 text-right">₹{(item.qty * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-10">
                    <div className="w-64">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Subtotal</span>
                            <span className="text-gray-800">₹{order.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Tax</span>
                            <span className="text-gray-800">₹{order.taxPrice}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Shipping</span>
                            <span className="text-gray-800">₹{order.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-800 font-bold text-lg">Total</span>
                            <span className="text-blue-600 font-bold text-lg">₹{order.totalPrice}</span>
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
                    <p className="mt-4 text-sm text-gray-500">Thank you for your business!</p>
                </div>

                {/* Footer for Print */}
                <div className="hidden print:block text-center mt-10 pt-8 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">Thank you for shopping with NewBuy!</p>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
