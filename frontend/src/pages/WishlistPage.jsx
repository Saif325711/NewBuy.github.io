import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import WishlistContext from '../context/WishlistContext';
import CartContext from '../context/CartContext';

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
                    <div className="text-center py-20">
                        <Heart size={64} className="mx-auto text-gray-600 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-600 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Save your favorite items to review them later!</p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Wishlist ({wishlistItems.length})</h1>
                    <button
                        onClick={clearWishlist}
                        className="text-red-500 hover:text-red-400 font-semibold transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:border-gray-400 transition-all group"
                        >
                            <Link to={`/product/${product._id}`}>
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.images && product.images[0] ? product.images[0] : (product.image || 'https://via.placeholder.com/300')}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link to={`/product/${product._id}`}>
                                    <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                                        {product.category || 'Collection'}
                                    </div>
                                    <h3 className="text-slate-900 font-bold text-lg mb-2 truncate hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xl font-bold text-slate-900">₹{product.price}</span>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={16} />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
