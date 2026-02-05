import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { ChevronLeft, Truck, FileText } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/orders/${id}`);
            setOrder(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch order');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const deliverHandler = async () => {
        try {
            await axios.put(`/orders/${id}/status`, { status: 'Delivered' });
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order');
        }
    };

    if (loading) return <div className="p-4 dark:text-white">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <Link to="/orders" className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6">
                <ChevronLeft size={20} className="mr-1" />
                Back to Orders
            </Link>

            <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order {order._id}</h1>
                <Link to={`/orders/${id}/invoice`} className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-4 py-2 rounded-md flex items-center transition-colors">
                    <FileText size={18} className="mr-2" />
                    Print Invoice
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Shipping */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping</h2>
                        <p className="text-gray-600 dark:text-gray-300"><strong>Name: </strong> {order.user.name}</p>
                        <p className="text-gray-600 dark:text-gray-300"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-500">{order.user.email}</a></p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        <div className={`mt-4 p-3 rounded-md ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isDelivered ? `Delivered on ${order.deliveredAt}` : 'Not Delivered'}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Method</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        <div className={`mt-4 p-3 rounded-md ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isPaid ? `Paid on ${order.paidAt}` : 'Not Paid'}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <p>Order is empty</p>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="py-4 flex items-center">
                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        </div>
                                        <div className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sticky top-24">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Items</span>
                                <span>${order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Shipping</span>
                                <span>${order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Tax</span>
                                <span>${order.taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {!order.isDelivered && (
                            <button
                                onClick={deliverHandler}
                                className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Mark As Delivered
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
