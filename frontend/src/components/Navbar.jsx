import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, LogOut } from 'lucide-react';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);



    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Top Row: Logo, Search, Icons */}
                <div className="flex items-center justify-between gap-3 h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl md:text-2xl font-bold text-slate-900 tracking-wider">
                            NEW<span className="text-blue-600">BUY</span>
                        </Link>
                    </div>

                    {/* Search Icon */}
                    <div className="flex-1 flex justify-center">
                        <button
                            onClick={() => navigate('/search')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Search Products"
                        >
                            <Search className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
                        <Link to="/wishlist" className="text-gray-700 hover:text-slate-900 relative">
                            <Heart className="h-5 w-5 md:h-6 md:w-6" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-[10px]">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>



                        <div className="relative">
                            {user ? (
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-slate-900 focus:outline-none"
                                >
                                    <User className="h-5 w-5 md:h-6 md:w-6" />
                                </button>
                            ) : (
                                <Link to="/login" className="text-gray-700 hover:text-slate-900">
                                    <User className="h-5 w-5 md:h-6 md:w-6" />
                                </Link>
                            )}

                            {/* User Dropdown */}
                            {showUserMenu && user && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowUserMenu(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setShowUserMenu(false);
                                                alert("Logout successful");
                                                navigate('/');
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <Link to="/cart" className="text-gray-700 hover:text-slate-900 relative">
                            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-[10px]">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex justify-center items-center space-x-8 pb-3 border-t border-gray-100 pt-2">
                    <Link to="/" className="text-gray-700 hover:text-slate-900 font-medium transition-colors text-sm">Home</Link>
                    <Link to="/category/men" className="text-gray-700 hover:text-slate-900 font-medium transition-colors text-sm">Men</Link>
                    <Link to="/category/women" className="text-gray-700 hover:text-slate-900 font-medium transition-colors text-sm">Women</Link>
                    <Link to="/category/accessories" className="text-gray-700 hover:text-slate-900 font-medium transition-colors text-sm">Accessories</Link>
                </div>

                {/* Mobile Navigation Links */}
                <div className="md:hidden border-t border-gray-200 pt-1 pb-1">
                    <div className="flex justify-around items-center">
                        <Link to="/" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-1.5">Home</Link>
                        <Link to="/category/men" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-1.5">Men</Link>
                        <Link to="/category/women" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-1.5">Women</Link>
                        <Link to="/category/accessories" className="text-xs font-medium text-gray-700 hover:text-slate-900 transition-colors py-1.5">Accessories</Link>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
