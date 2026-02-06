import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Search, ArrowLeft, Filter } from 'lucide-react';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const allProducts = await getAllProducts();
                setProducts(allProducts);
                setFilteredProducts(allProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory, products]);

    const handleSearch = () => {
        setSearchQuery(searchInput);
        if (searchInput) {
            setSearchParams({ q: searchInput });
        } else {
            setSearchParams({});
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

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
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Search Products
                    </h1>
                    <p className="text-gray-600">
                        {loading ? 'Loading...' : (
                            searchQuery
                                ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${searchQuery}"`
                                : `Showing all ${filteredProducts.length} products`
                        )}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 space-y-4">
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, category, or description..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <Search size={20} />
                                <span className="hidden md:inline">Search</span>
                            </button>
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchInput('');
                                        setSearchQuery('');
                                        setSearchParams({});
                                    }}
                                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Filter size={20} className="text-gray-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
                            <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${selectedCategory === category
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category === 'all' ? 'All' : category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchQuery
                                ? `No results for "${searchQuery}"`
                                : 'Try adjusting your filters'
                            }
                        </p>
                        <button
                            onClick={() => {
                                setSearchInput('');
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSearchParams({});
                            }}
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
