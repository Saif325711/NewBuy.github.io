import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:border-gray-400 transition-all group">
            <Link to={`/product/${product._id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                        src={product.images && product.images[0] ? product.images[0] : (product.image || 'https://via.placeholder.com/300')}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.countInStock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            Out of Stock
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                        {product.category || 'Collection'}
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg mb-2 truncate hover:text-blue-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-xl font-bold text-slate-900">₹{product.price}</span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors flex items-center justify-center">
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
