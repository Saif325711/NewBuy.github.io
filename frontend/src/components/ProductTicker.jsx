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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto">
                <Link
                    to={`/product/${currentProduct._id}`}
                    className="flex items-center justify-center space-x-3 hover:opacity-90 transition-opacity"
                >
                    <span className="text-xs font-semibold uppercase tracking-wide">🔥 Recommended:</span>
                    <span className="text-sm font-bold animate-pulse">{currentProduct.name}</span>
                    <span className="text-xs">•</span>
                    <span className="text-sm font-semibold">₹{currentProduct.price}</span>
                    {currentProduct.purchasePrice && (
                        <span className="text-xs line-through text-white/70">₹{currentProduct.purchasePrice}</span>
                    )}
                </Link>
            </div>
        </div>
    );
};

export default ProductTicker;
