import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { ShieldCheck, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import axios from '../api/axios';

const CheckoutPage = () => {
    const { cartItems, shippingAddress, saveShippingAddress, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Local state for form if not using context directly for inputs
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const [mobile, setMobile] = useState(shippingAddress.mobile || '');
    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.18; // Example 18% tax
    const shippingPrice = subtotal > 1000 ? 0 : 100;
    const totalPrice = subtotal + tax + shippingPrice;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country, mobile });

        // Prepare Order Data
        const orderData = {
            orderItems: cartItems,
            shippingAddress: { address, city, postalCode, country, mobile },
            paymentMethod,
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice,
            totalPrice,
        };

        try {
            // Check if Razorpay script is loaded
            const res = await loadRazorpayScript();

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 1. Create Order on Backend
            const { data: orderResponse } = await axios.post('/orders', orderData);

            // Handle Cash on Delivery (COD)
            if (paymentMethod === 'COD') {
                alert('Order Placed Successfully via Cash on Delivery!');
                clearCart();
                navigate('/');
                return;
            }

            const rzpKey = orderResponse.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
            console.log('Using Razorpay Key:', rzpKey);

            // CHECK FOR SIMULATION (If Backend failed to create real order due to missing Secret)
            if (orderResponse.razorpayOrderId && orderResponse.razorpayOrderId.startsWith('order_SIMULATED')) {
                console.warn('Backend returned SIMULATED order. Likely missing Key Secret.');
                alert('Test Mode: Payment Simulated Successfully! (Backend Key Secret missing)');
                // Verify Payment on Backend (Simulated)
                await axios.put(`/orders/${orderResponse._id}/pay`, {
                    id: 'pay_SIMULATED_' + Date.now(),
                    status: 'captured',
                    update_time: new Date().toISOString(),
                    email_address: 'test@example.com'
                });
                clearCart();
                navigate('/');
                return;
            }

            // 2. Initialize Razorpay (Real Mode)
            const options = {
                key: rzpKey,
                amount: Math.round(orderResponse.totalPrice * 100), // Ensure integer
                currency: "INR",
                name: "NewBuy Streetwear",
                description: "Transaction",
                image: "/images/logo.png",
                order_id: orderResponse.razorpayOrderId,
                handler: async function (response) {
                    console.log('Payment Handler Response:', response);
                    try {
                        // Verify Payment on Backend
                        await axios.put(`/orders/${orderResponse._id}/pay`, {
                            id: response.razorpay_payment_id,
                            status: 'success',
                            update_time: new Date().toISOString(),
                            email_address: 'user@example.com',
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        alert('Payment Successful! Order Placed.');
                        clearCart();
                        navigate('/');
                    } catch (err) {
                        console.error('Payment Verification Failed:', err);
                        const msg = err.response?.data?.message || err.message || 'Payment successful, but verification failed.';
                        alert(msg);
                    }
                },
                prefill: {
                    name: "NewBuy User",
                    email: "user@example.com",
                    contact: mobile || "9999999999"
                },
                theme: {
                    color: "#2563EB"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Checkout Error:', error);
            const msg = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
            alert(msg);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center text-gray-600 hover:text-slate-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Cart
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Forms */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                            Shipping Address
                        </h2>

                        <form id="checkout-form" onSubmit={submitHandler} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Full Address</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500"
                                    placeholder="123 Street Name, Area"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500"
                                    placeholder="9876543210"
                                    pattern="[0-9]{10}"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500"
                                        placeholder="000000"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Country</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500"
                                    placeholder="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>
                        </form>

                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                            Payment Method
                        </h2>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                            <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Razorpay"
                                    checked={paymentMethod === 'Razorpay'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 h-5 w-5 bg-white border-gray-600"
                                />
                                <div className="ml-4 flex-1">
                                    <span className="block font-bold">Razorpay</span>
                                    <span className="text-sm text-gray-600">Pay securely with Credit Card, UPI, or Netbanking</span>
                                </div>
                                <CreditCard className="text-blue-500" />
                            </label>

                            {/* Add more methods later */}
                            <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 h-5 w-5 bg-white border-gray-600"
                                />
                                <div className="ml-4 flex-1">
                                    <span className="block font-bold">Cash on Delivery</span>
                                    <span className="text-sm text-gray-600">Pay with cash upon delivery</span>
                                </div>
                                <Truck className="text-gray-500" />
                            </label>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="bg-white rounded-xl p-6 h-fit border border-gray-200 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={`${item._id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                                        <p className="text-xs text-gray-600">{item.qty} x ₹{item.price}</p>
                                    </div>
                                    <div className="font-bold text-gray-700">₹{item.qty * item.price}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mb-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Tax (18%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping</span>
                                <span>{shippingPrice === 0 ? <span className="text-green-400">Free</span> : `₹${shippingPrice}`}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold text-slate-900 mb-8 border-t border-gray-200 pt-6">
                            <span>Total</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-900/50"
                        >
                            <ShieldCheck size={20} />
                            <span>Place Order & Pay</span>
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500 flex items-center justify-center">
                                <ShieldCheck size={14} className="mr-1" /> Secure Payment by Razorpay
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
