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
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-2.5 px-4 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto">
                <Link
                    to={`/product/${currentProduct._id}`}
                    className="flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity"
                >
                    {/* Product Image */}
                    <img
                        src={currentProduct.images?.[0] || currentProduct.image}
                        alt={currentProduct.name}
                        className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border-2 border-white shadow-md"
                    />

                    {/* Recommended Badge */}
                    <span className="text-xs font-semibold uppercase tracking-wide bg-white/20 px-2 py-1 rounded">
                        🔥 Hot Deal
                    </span>

                    {/* Product Name */}
                    <span className="text-sm md:text-base font-bold truncate max-w-xs">{currentProduct.name}</span>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm md:text-lg font-bold bg-white text-pink-600 px-2 py-0.5 rounded">
                            ₹{currentProduct.price}
                        </span>
                        {currentProduct.purchasePrice && (
                            <span className="text-xs line-through text-white/70">₹{currentProduct.purchasePrice}</span>
                        )}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ProductTicker;
