import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart } from 'lucide-react';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import { getAllProducts } from '../services/productService';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search products using Firestore
    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length === 0) {
                setSearchResults([]);
                setShowSearchResults(false);
                return;
            }

            setIsLoading(true);
            try {
                const products = await getAllProducts();
                const filtered = products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
                setShowSearchResults(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleProductClick = (productId) => {
        setShowSearchResults(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Top Row: Logo, Search (Desktop), Icons */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl md:text-2xl font-bold text-slate-900 tracking-wider">
                            NEW<span className="text-blue-600">BUY</span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchRef}>
                        <div className="relative w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery && setShowSearchResults(true)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>

                            {/* Search Results Dropdown */}
                            {showSearchResults && (
                                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500">Searching...</div>
                                    ) : searchResults.length > 0 ? (
                                        <div>
                                            {searchResults.map(product => (
                                                <div
                                                    key={product._id}
                                                    onClick={() => handleProductClick(product._id)}
                                                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                                >
                                                    <img
                                                        src={product.images?.[0] || product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.category}</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-900">₹{product.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">No products found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-slate-900 font-medium transition-colors">Home</Link>
                        <a href="#men" className="text-gray-700 hover:text-slate-900 font-medium transition-colors">Men</a>
                        <a href="#women" className="text-gray-700 hover:text-slate-900 font-medium transition-colors">Women</a>
                        <a href="#accessories" className="text-gray-700 hover:text-slate-900 font-medium transition-colors">Accessories</a>
                    </div>

                    {/* Icons (Desktop & Mobile) */}
                    <div className="flex items-center space-x-4">
                        <Link to="/wishlist" className="text-gray-700 hover:text-slate-900 relative">
                            <Heart className="h-6 w-6" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/login" className="text-gray-700 hover:text-slate-900">
                            <User className="h-6 w-6" />
                        </Link>

                        <Link to="/cart" className="text-gray-700 hover:text-slate-900 relative">
                            <ShoppingCart className="h-6 w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile: Search Bar */}
                <div className="md:hidden pb-3" ref={searchRef}>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setShowSearchResults(true)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Mobile Search Results */}
                    {showSearchResults && (
                        <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                <div>
                                    {searchResults.map(product => (
                                        <div
                                            key={product._id}
                                            onClick={() => handleProductClick(product._id)}
                                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                        >
                                            <img
                                                src={product.images?.[0] || product.image}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.category}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">₹{product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">No products found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile: Navigation Links */}
                <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
                    <div className="flex justify-around items-center">
                        <Link to="/" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-2">Home</Link>
                        <a href="#men" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-2">Men</a>
                        <a href="#women" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-2">Women</a>
                        <a href="#accessories" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-2">Accessories</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
