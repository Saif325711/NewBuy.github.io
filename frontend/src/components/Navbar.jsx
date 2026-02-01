import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import axios from '../api/axios';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search products
    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length === 0) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const { data } = await axios.get('/products');
                const filtered = data.products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
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
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(`/product/${productId}`);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-slate-900 tracking-wider">
                            NEW<span className="text-blue-600">BUY</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <a href="#" className="text-gray-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Men</a>
                            <a href="#" className="text-gray-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Women</a>
                            <a href="#" className="text-gray-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Accessories</a>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Search Button & Modal */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="text-gray-600 hover:text-slate-900 transition-colors"
                            >
                                <Search size={20} />
                            </button>

                            {/* Search Dropdown */}
                            {isSearchOpen && (
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                                    <div className="p-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search products..."
                                                className="w-full bg-gray-50 text-slate-900 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                                                autoFocus
                                            />
                                            <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
                                        </div>
                                    </div>

                                    {/* Search Results */}
                                    <div className="max-h-96 overflow-y-auto">
                                        {isLoading ? (
                                            <div className="p-4 text-center text-gray-600">Searching...</div>
                                        ) : searchQuery.trim() && searchResults.length === 0 ? (
                                            <div className="p-4 text-center text-gray-600">No products found</div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="border-t border-gray-200">
                                                {searchResults.map(product => (
                                                    <button
                                                        key={product._id}
                                                        onClick={() => handleProductClick(product._id)}
                                                        className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors text-left"
                                                    >
                                                        <img
                                                            src={product.images?.[0] || product.image || 'https://via.placeholder.com/60'}
                                                            alt={product.name}
                                                            className="w-12 h-12 rounded object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="text-slate-900 font-medium truncate">{product.name}</h4>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-600">{product.category}</span>
                                                                <span className="text-blue-600 font-bold">₹{product.price}</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-gray-600 text-sm">
                                                Start typing to search products...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/wishlist" className="text-gray-600 hover:text-slate-900 transition-colors relative">
                            <Heart size={20} />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="text-gray-600 hover:text-slate-900 transition-colors relative">
                            <ShoppingCart size={20} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>
                        <Link to="/login" className="text-gray-600 hover:text-slate-900 transition-colors">
                            <User size={20} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-slate-900 p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 pt-4 pb-4 space-y-4">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full bg-gray-50 text-slate-900 rounded-lg py-2 pl-4 pr-10 focus:outline-none border border-gray-300"
                            />
                            <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
                        </div>

                        {/* Mobile Search Results */}
                        {searchQuery.trim() && (
                            <div className="mb-4 space-y-2">
                                {searchResults.length > 0 ? (
                                    searchResults.map(product => (
                                        <button
                                            key={product._id}
                                            onClick={() => handleProductClick(product._id)}
                                            className="w-full flex items-center space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <img
                                                src={product.images?.[0] || product.image || 'https://via.placeholder.com/40'}
                                                alt={product.name}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                            <div className="flex-1 text-left">
                                                <h4 className="text-slate-900 text-sm font-medium truncate">{product.name}</h4>
                                                <span className="text-blue-600 text-sm font-bold">₹{product.price}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-gray-600 text-sm">No results</div>
                                )}
                            </div>
                        )}

                        <Link to="/" className="block text-gray-700 hover:text-slate-900 py-2">Home</Link>
                        <Link to="/products" className="block text-gray-700 hover:text-slate-900 py-2">Shop</Link>
                        <Link to="/categories" className="block text-gray-700 hover:text-slate-900 py-2">Categories</Link>
                        <div className="flex space-x-4 pt-4 border-t border-gray-200">
                            <Link to="/login" className="flex items-center text-gray-700 hover:text-slate-900">
                                <User size={20} className="mr-2" /> Login
                            </Link>
                            <Link to="/cart" className="flex items-center text-gray-700 hover:text-slate-900">
                                <ShoppingCart size={20} className="mr-2" /> Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
