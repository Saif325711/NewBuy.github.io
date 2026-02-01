import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ChevronLeft, Plus, Trash2, Save } from 'lucide-react';

const OrderCreate = () => {
    const navigate = useNavigate();

    // Data Sources
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    // Form State
    const [selectedUser, setSelectedUser] = useState('');
    const [cartItems, setCartItems] = useState([]);

    // Item Addition State
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(''); // Stores entire variant obj or string
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, productsRes] = await Promise.all([
                    axios.get('/auth/users'),
                    axios.get('/products?pageNumber=1&keyword=') // Fetch all products (limit might need adjusting)
                ]);
                setUsers(usersRes.data);
                // Handle pagination response structure or direct list
                setProducts(productsRes.data.products || productsRes.data);
            } catch (err) {
                setError('Failed to load initial data');
            }
        };
        fetchData();
    }, []);

    // Derived Product Data
    const activeProduct = products.find(p => p._id === selectedProduct);
    const variants = activeProduct?.variants || [];

    const addToCart = () => {
        if (!activeProduct) return;

        const newItem = {
            product: activeProduct._id,
            name: activeProduct.name,
            image: activeProduct.image || (activeProduct.images && activeProduct.images[0]),
            price: activeProduct.price,
            qty: Number(quantity),
            variant: selectedVariant ? (typeof selectedVariant === 'string' ? selectedVariant : `${selectedVariant.size} / ${selectedVariant.color}`) : null
        };

        setCartItems([...cartItems, newItem]);
        // Reset selection
        setSelectedProduct('');
        setSelectedVariant('');
        setQuantity(1);
    };

    const removeFromCart = (index) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    };

    const handleSubmit = async () => {
        if (!selectedUser) {
            setError('Please select a customer');
            return;
        }
        if (cartItems.length === 0) {
            setError('Please add at least one product');
            return;
        }

        try {
            setLoading(true);
            const orderData = {
                user: selectedUser,
                orderItems: cartItems,
                paymentMethod: 'Manual',
                totalPrice: calculateTotal(),
                shippingPrice: 0,
                taxPrice: 0,
                itemsPrice: calculateTotal()
            };

            await axios.post('/orders', orderData);
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/orders" className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <ChevronLeft size={20} className="mr-1" />
                    Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Manual Order</h1>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Customer Selection */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-1 h-fit">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Customer</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select User</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                        >
                            <option value="">-- Select Customer --</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Only registered users can be selected.</p>
                    </div>
                </div>

                {/* Right: Product Selection & Cart */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Add Products</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product</label>
                                <select
                                    value={selectedProduct}
                                    onChange={(e) => {
                                        setSelectedProduct(e.target.value);
                                        setSelectedVariant('');
                                    }}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                                >
                                    <option value="">-- Select Product --</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} - ${p.price}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Variant Select - Only if variants exist */}
                            {variants.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variant</label>
                                    <select
                                        value={typeof selectedVariant === 'string' ? '' : JSON.stringify(selectedVariant)} // Simple visual hack
                                        onChange={(e) => {
                                            // Find matching variant or parse
                                            const val = e.target.value;
                                            // We just store the object or string directly in state for simplicity
                                            const v = variants.find(v => (v.size + v.color) === val) || JSON.parse(val || '{}');
                                            setSelectedVariant(v);
                                        }}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                                    >
                                        <option value="">Select Variant</option>
                                        {variants.map((v, i) => (
                                            <option key={i} value={JSON.stringify(v)}>{v.size} - {v.color} (Stock: {v.stock})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                                />
                            </div>

                            <button
                                onClick={addToCart}
                                disabled={!selectedProduct}
                                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                            >
                                <Plus size={20} className="mr-1" /> Add
                            </button>
                        </div>
                    </div>

                    {/* Order Items List */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Order Items</h3>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 italic">No items added yet.</p>
                        ) : (
                            <div className="border rounded-md divide-y dark:border-gray-700 dark:divide-gray-700">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3">
                                        <div className="flex items-center">
                                            {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-3" />}
                                            <div>
                                                <p className="font-medium dark:text-white">{item.name}</p>
                                                {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-600 dark:text-gray-300">{item.qty} x ${item.price}</span>
                                            <span className="font-bold dark:text-white">${item.qty * item.price}</span>
                                            <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center font-bold">
                                    <span className="dark:text-white">Total</span>
                                    <span className="dark:text-white text-xl">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || cartItems.length === 0 || !selectedUser}
                            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center font-medium"
                        >
                            <Save size={20} className="mr-2" />
                            Create Order
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderCreate;
