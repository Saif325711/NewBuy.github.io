import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import CartContext from '../context/CartContext';
import SettingsContext from '../context/SettingsContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
    const { shippingCharge, freeShippingThreshold, loading: settingsLoading } = useContext(SettingsContext);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white text-slate-900 pt-20 px-4">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={40} className="text-gray-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Your cart is empty</h1>
                    <p className="text-gray-600">Looks like you haven't added any streetwear gear yet.</p>
                    <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={`${item._id}-${item.size}-${item.color}`} className="bg-white rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 border border-gray-200">
                                {/* Image */}
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image || (item.images && item.images[0]) || 'https://via.placeholder.com/100'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{item.brand} | {item.category}</p>
                                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                                        {item.size && <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>}
                                        {item.color && <span className="bg-gray-100 px-2 py-1 rounded">Color: {item.color}</span>}
                                    </div>
                                    <div className="mt-3 font-bold text-xl text-blue-600">₹{item.price * item.qty}</div>
                                </div>

                                {/* Quantity & Remove */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="flex items-center space-x-3 bg-white rounded-lg p-1 border border-gray-300">
                                        <button
                                            onClick={() => updateQty(item._id, item.size, item.color, Math.max(1, item.qty - 1))}
                                            className="p-1 hover:text-blue-600"
                                            disabled={item.qty <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold w-6 text-center text-sm">{item.qty}</span>
                                        <button
                                            onClick={() => {
                                                // Get max stock for this variant
                                                const maxStock = item.variants?.find(v => v.size === item.size && v.color === item.color)?.stock || item.stock || item.countInStock || 999;

                                                if (item.qty >= maxStock) {
                                                    alert(`Only ${maxStock} items available in stock!`);
                                                    return;
                                                }
                                                updateQty(item._id, item.size, item.color, item.qty + 1);
                                            }}
                                            className="p-1 hover:text-blue-600"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id, item.size, item.color)}
                                        className="text-gray-500 hover:text-red-500 transition-colors text-sm flex items-center"
                                    >
                                        <Trash2 size={16} className="mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl p-6 h-fit border border-gray-200 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Shipping</span>
                                <span className={subtotal > freeShippingThreshold ? "text-green-400" : ""}>
                                    {subtotal > freeShippingThreshold ? 'Free' : `₹${shippingCharge}`}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold text-slate-900 mb-8">
                            <span>Total</span>
                            <span>₹{subtotal + (subtotal > freeShippingThreshold ? 0 : Number(shippingCharge))}</span>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-900/50"
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CartPage;
