import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const allProducts = await getAllProducts();

                // Define parent categories and their subcategories
                const menCategories = ['T-Shirt', 'Shirt', 'Baggy Pants', 'Short', 'Shorts', 'Panjabi', 'Hoodie', 'Sweatshirts', 'Pants'];
                const womenCategories = ['Women T-Shirt', 'Women Shirt', 'Dress', 'Skirt', 'Women Pants'];

                let filtered;

                // Handle parent categories
                if (category.toLowerCase() === 'men') {
                    filtered = allProducts.filter(product =>
                        menCategories.some(cat =>
                            product.category?.toLowerCase() === cat.toLowerCase()
                        )
                    );
                } else if (category.toLowerCase() === 'women') {
                    filtered = allProducts.filter(product =>
                        womenCategories.some(cat =>
                            product.category?.toLowerCase() === cat.toLowerCase()
                        )
                    );
                } else {
                    // Filter products by exact category match (case-insensitive)
                    filtered = allProducts.filter(product =>
                        product.category?.toLowerCase() === category.toLowerCase()
                    );
                }

                setProducts(filtered);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div className="min-h-screen bg-white pt-6 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center text-gray-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
                </Link>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        {categoryTitle}
                    </h1>
                    <p className="text-gray-600">
                        {loading ? 'Loading...' : `${products.length} products found`}
                    </p>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            No products available in {categoryTitle} category yet.
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
