import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';

const ProductTicker = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getAllProducts();
                setProducts(allProducts);
            } catch (error) {
                console.error('Error fetching products for ticker:', error);
            }
        };
        fetchProducts();
    }, []);

    // Auto-scroll every 2 seconds
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [products]);

    if (products.length === 0) return null;

    const currentProduct = products[currentIndex];

    return (
        <div className="bg-white border-b border-gray-200 py-2.5 px-4 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Main Ticker Content */}
                <Link
                    to={`/product/${currentProduct._id}`}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-1"
                >
                    {/* Product Image */}
                    <img
                        src={currentProduct.images?.[0] || currentProduct.image}
                        alt={currentProduct.name}
                        className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border border-gray-300"
                    />

                    {/* Product Name */}
                    <span className="text-sm md:text-base font-semibold text-gray-900 truncate max-w-xs md:max-w-md">
                        {currentProduct.name}
                    </span>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm md:text-lg font-bold text-blue-600">
                            ₹{currentProduct.price}
                        </span>
                        {currentProduct.purchasePrice && (
                            <span className="text-xs line-through text-gray-500">₹{currentProduct.purchasePrice}</span>
                        )}
                    </div>
                </Link>

                {/* AD Label */}
                <div className="ml-4 flex-shrink-0">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                        AD
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductTicker;
