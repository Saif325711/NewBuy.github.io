/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import hoodieImage from '../assets/hooddie.webp';
import hoodieHero from '../assets/hoodie.png';
import baggyImage from '../assets/baggy.jpg';
import tshirtImage from '../assets/blacktshirt.jpeg';
import panjabiImage from '../assets/panjabi.jpg';
import shortImage from '../assets/short.avif';
import shirtImage from '../assets/strip.jpg';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fixed category configuration with images
    const categories = [
        { name: 'T-Shirt', image: tshirtImage, id: 't-shirt' },
        { name: 'Shirt', image: shirtImage, id: 'shirt' },
        { name: 'Hoodie', image: hoodieImage, id: 'hoodie' },
        { name: 'Baggy Pants', image: baggyImage, id: 'baggy-pants' },
        { name: 'Short', image: shortImage, id: 'short' },
        { name: 'Panjabi', image: panjabiImage, id: 'panjabi' }
    ];

    const handleCategoryClick = (categoryName) => {
        // Navigate to category page with the category name
        navigate(`/category/${categoryName.toLowerCase().replace(/ /g, '-')}`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
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
                    alt="SaiFlex Streetwear Collection"
                    className="w-full h-auto object-cover object-top max-h-[700px]"
                />
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 md:top-[75%] md:left-[25%] md:translate-x-0 md:bottom-auto">
                    <a
                        href="#latest-drops"
                        className="bg-black border border-black text-white font-bold py-2 px-5 text-xs md:py-3 md:px-10 md:text-base rounded-full hover:bg-gray-900 transition-all transform hover:scale-105 shadow-xl whitespace-nowrap"
                    >
                        Shop Now
                    </a>
                </div>
            </div>

            {/* Category Navigation Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 border-l-4 border-blue-600 pl-4">Shop by Category</h2>

                {/* Horizontal Scrollable Category Buttons */}
                <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.name)}
                                className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer snap-start"
                            >
                                {/* Circular Image Button */}
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-blue-600 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Overlay for better text visibility */}
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                                </div>

                                {/* Category Name */}
                                <span className="text-sm md:text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Promotional Banner Section - Scrolling Text */}
            <div className="border-y border-gray-200 py-3 overflow-hidden bg-white">
                <div className="animate-marquee whitespace-nowrap">
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        🎁 Get 10% OFF on your first order
                    </span>
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        🚚 Free Shipping on orders above ₹999
                    </span>
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        ↩️ Easy Returns - 7 day return policy
                    </span>
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        ⚡ New Arrivals Every Week
                    </span>
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        🎁 Get 10% OFF on your first order
                    </span>
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        🚚 Free Shipping on orders above ₹999
                    </span>
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        ↩️ Easy Returns - 7 day return policy
                    </span>
                    <span className="text-gray-800 text-base font-semibold mx-8">
                        ⚡ New Arrivals Every Week
                    </span>
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
                                <div key={categoryName} id={`category-${categoryName}`}>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                        <span className="bg-gray-100 px-4 py-1 rounded-lg border border-gray-300">{categoryName}</span>
                                        <span className="ml-4 h-px bg-gray-300 flex-grow"></span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                                        {categoryProducts.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Fallback if no products have categories yet */}
                        {products.every(p => !p.category) && products.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
