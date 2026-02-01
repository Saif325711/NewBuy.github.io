import { useState, useEffect } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import hoodieHero from '../assets/hoodie.png';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/products');
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative w-full">
                <img
                    src={hoodieHero}
                    alt="NewBuy Streetwear Collection"
                    className="w-full h-auto object-cover object-top max-h-[700px]"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:top-[75%] md:left-[25%] md:translate-x-0 md:translate-y-0">
                    <a
                        href="#latest-drops"
                        className="bg-black border border-black text-white font-bold py-2 px-6 text-sm md:py-3 md:px-10 md:text-base rounded-full hover:bg-gray-900 transition-all transform hover:scale-105 shadow-xl whitespace-nowrap"
                    >
                        Shop Now
                    </a>
                </div>
            </div>

            {/* Latest Drops Section */}
            <div id="latest-drops" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 border-l-4 border-blue-600 pl-4">Latest Drops</h2>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="text-blue-600 text-xl animate-pulse">Loading amazing gear...</div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Logic to get unique categories */}
                        {[...new Set(products.map(p => p.category))].filter(Boolean).sort().map(categoryName => {
                            const categoryProducts = products.filter(p => p.category === categoryName);
                            return (
                                <div key={categoryName}>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                        <span className="bg-gray-100 px-4 py-1 rounded-lg border border-gray-300">{categoryName}</span>
                                        <span className="ml-4 h-px bg-gray-300 flex-grow"></span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {categoryProducts.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Fallback if no products have categories yet */}
                        {products.every(p => !p.category) && products.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>


        </div>
    );
};

export default Home;
