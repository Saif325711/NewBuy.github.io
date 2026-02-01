import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById, getProductsByCategory } from '../services/productService';
import { ShoppingCart, Heart, ChevronLeft, Minus, Plus, Share2, Zap, Check } from 'lucide-react';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import ProductTicker from '../components/ProductTicker';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [shareSuccess, setShareSuccess] = useState(false);

    // Selection State
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [imageContainerSize, setImageContainerSize] = useState({ width: 1, height: 1 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setZoomPosition({ x, y });
        setImageContainerSize({ width: rect.width, height: rect.height });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);

                // Set defaults
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                } else if (data.image) {
                    setSelectedImage(data.image);
                }

                if (data.variants && data.variants.length > 0) {
                    setSelectedSize(data.variants[0].size);
                    setSelectedColor(data.variants[0].color);
                }

                setLoading(false);

                // Fetch recommended products from same category
                fetchRecommendedProducts(data.category, data._id);
            } catch (err) {
                console.error('ProductDetail Error:', err);
                setError('Failed to load product details.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const fetchRecommendedProducts = async (category, currentProductId) => {
        try {
            const allProducts = await getProductsByCategory(category);
            const related = allProducts
                .filter(p => p._id !== currentProductId)
                .slice(0, 4); // Get top 4 related products
            setRecommendedProducts(related);
        } catch (error) {
            console.error('Error fetching recommended products:', error);
        }
    };

    const handleQuantityChange = (type) => {
        if (type === 'inc') {
            if (quantity >= maxStock) {
                // Show popup when trying to exceed stock
                alert(`Only ${maxStock} items available in stock!`);
                return;
            }
            setQuantity(prev => prev + 1);
        } else {
            setQuantity(prev => (prev > 1 ? prev - 1 : 1));
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Check stock availability
        if (quantity > maxStock) {
            alert(`Only ${maxStock} items available in stock. Please reduce quantity.`);
            setQuantity(maxStock > 0 ? maxStock : 1);
            return;
        }

        // Check if product already in cart
        if (isInCart(product._id, selectedSize, selectedColor)) {
            // Navigate to cart
            navigate('/cart');
            return;
        }

        addToCart(product, quantity, selectedSize, selectedColor);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!product) return;
        addToCart(product, quantity, selectedSize, selectedColor);
        navigate('/checkout');
    };

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on NewBuy!`,
            url: window.location.href
        };

        // Try Web Share API first (for mobile)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShareSuccess(true);
                setTimeout(() => setShareSuccess(false), 2000);
            } catch (err) {
                console.error('Copy failed:', err);
                alert('Share link: ' + window.location.href);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-blue-600 text-xl animate-pulse">Loading product details...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>{error}</p>
                <Link to="/" className="text-blue-600 hover:text-blue-700 mt-4 block">Back to Home</Link>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Link to="/" className="text-blue-600 hover:text-blue-700 mt-4 block">Back to Shop</Link>
            </div>
        </div>
    );

    // Derived State for Stock Check (Simple implementation)
    const currentVariant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor);
    const maxStock = product.variants?.length > 0 ? Math.max(...product.variants.map(v => v.stock || 0)) : (product.stock || 0);
    const isOutOfStock = maxStock === 0;

    return (
        <>
            {/* Scrolling Product Ticker */}
            <ProductTicker />
            <div className="bg-white min-h-screen text-slate-900 pt-8 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb / Back */}
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-slate-900 mb-8 transition-colors">
                        <ChevronLeft size={20} className="mr-1" /> Back to Shop
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div
                                className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-gray-300 relative cursor-none"
                                onMouseEnter={() => setShowZoom(true)}
                                onMouseLeave={() => setShowZoom(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <img
                                    src={selectedImage || 'https://via.placeholder.com/600'}
                                    alt={product.name}
                                    className="w-full h-full object-cover select-none"
                                />

                                {/* Magnifying Glass Lens */}
                                {showZoom && (
                                    <div
                                        className="absolute w-60 h-60 rounded-full overflow-hidden pointer-events-none shadow-2xl"
                                        style={{
                                            left: `${zoomPosition.x}px`,
                                            top: `${zoomPosition.y}px`,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundImage: `url(${selectedImage || 'https://via.placeholder.com/600'})`,
                                            backgroundSize: '800% 800%',
                                            backgroundPosition: `${(zoomPosition.x / imageContainerSize.width) * 100}% ${(zoomPosition.y / imageContainerSize.height) * 100}%`,
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    />
                                )}

                                {isOutOfStock && (
                                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                            {/* Thumbnail Strip (If multiple images exist - placeholder logic for now) */}
                            <div className="flex space-x-4 overflow-x-auto pb-2">
                                {[product.image, ...(product.images || [])].filter(Boolean).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${selectedImage === img ? 'border-blue-600' : 'border-gray-300 hover:border-gray-400'}`}
                                    >
                                        <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-2 text-blue-600 font-semibold tracking-wide uppercase text-sm">
                                {product.brand} • {product.category}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

                            <div className="flex items-center space-x-4 mb-6">
                                <span className="text-3xl font-bold">₹{product.price}</span>
                                {/* Placeholder for rating */}
                                <div className="flex items-center text-yellow-500">
                                    <span>★★★★☆</span>
                                    <span className="text-gray-600 text-sm ml-2">(42 reviews)</span>
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            <div className="border-t border-gray-200 pt-8 space-y-6">

                                {/* Variants Selection */}
                                {product.variants && product.variants.length > 0 && (
                                    <>
                                        {/* Size */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-3">Select Size</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {[...new Set(product.variants.map(v => v.size))].map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`px-4 py-2 rounded-lg border font-medium transition-all ${selectedSize === size
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'border-gray-300 text-gray-700 hover:border-gray-500'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Color */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 mb-3">Select Color</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {[...new Set(product.variants.map(v => v.color))].map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`px-4 py-2 rounded-lg border font-medium transition-all ${selectedColor === color
                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                            : 'border-gray-300 text-gray-700 hover:border-gray-500'
                                                            }`}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Quantity & Actions */}
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                                    <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1 border border-gray-300 w-fit">
                                        <button
                                            onClick={() => handleQuantityChange('dec')}
                                            className="p-2 hover:text-blue-600 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="font-bold w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('inc')}
                                            className="p-2 hover:text-blue-600 transition-colors"
                                            disabled={quantity >= maxStock}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (isInCart(product._id, selectedSize, selectedColor)) {
                                                navigate('/cart');
                                            } else {
                                                handleAddToCart();
                                            }
                                        }}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-lg transition-all ${isOutOfStock
                                            ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                                            : isInCart(product._id, selectedSize, selectedColor)
                                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                                : added
                                                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50'
                                            }`}
                                        disabled={isOutOfStock}
                                    >
                                        {isOutOfStock ? (
                                            <>
                                                <span>Out of Stock</span>
                                            </>
                                        ) : isInCart(product._id, selectedSize, selectedColor) ? (
                                            <>
                                                <ShoppingCart size={24} />
                                                <span>Go to Cart</span>
                                            </>
                                        ) : added ? (
                                            <>
                                                <Check size={24} />
                                                <span>Added!</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={24} />
                                                <span>Add to Cart</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleBuyNow}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-lg transition-all ${isOutOfStock
                                            ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/50'
                                            }`}
                                        disabled={isOutOfStock}
                                    >
                                        <Zap size={20} className="fill-current" />
                                        <span>Buy at ₹{product.price}</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (isInWishlist(product._id)) {
                                                removeFromWishlist(product._id);
                                            } else {
                                                addToWishlist(product);
                                            }
                                        }}
                                        className={`p-4 rounded-xl border transition-all ${isInWishlist(product._id)
                                            ? 'bg-red-500 border-red-500 text-white'
                                            : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                                            }`}
                                    >
                                        <Heart size={20} className={isInWishlist(product._id) ? 'fill-current' : ''} />
                                    </button>
                                </div>

                            </div>

                            {/* Additional Meta */}
                            <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                                <div>SKU: {product.sku || 'N/A'}</div>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center space-x-2 cursor-pointer hover:text-slate-900 transition-colors"
                                >
                                    {shareSuccess ? (
                                        <>
                                            <Check size={16} className="text-green-500" />
                                            <span className="text-green-500">Link Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 size={16} />
                                            <span>Share this product</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Recommended Products Section */}
                    {recommendedProducts.length > 0 && (
                        <div className="mt-20">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-blue-600 pl-4">
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {recommendedProducts.map((recommendedProduct) => (
                                    <ProductCard key={recommendedProduct._id} product={recommendedProduct} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Mobile Sticky Bottom Bar (Flipkart-style) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-3 flex items-center space-x-3 z-50 shadow-lg">
                <button
                    onClick={() => {
                        if (isInCart(product._id, selectedSize, selectedColor)) {
                            navigate('/cart');
                        } else {
                            handleAddToCart();
                        }
                    }}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-bold transition-all ${isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isInCart(product._id, selectedSize, selectedColor)
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    <ShoppingCart size={20} />
                    <span>{isOutOfStock ? 'Out of Stock' : isInCart(product._id, selectedSize, selectedColor) ? 'Go to Cart' : 'Add to Cart'}</span>
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-bold transition-all ${isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                >
                    <Zap size={20} className="fill-current" />
                    <span>Buy at ₹{product.price}</span>
                </button>
            </div>
        </>
    );
};

export default ProductDetail;
