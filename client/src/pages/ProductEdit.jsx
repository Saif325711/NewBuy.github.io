import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { ChevronLeft, Save, Upload, Plus, Trash2 } from 'lucide-react';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // General
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    // Categorization
    const [parentCategory, setParentCategory] = useState('Men');
    const [category, setCategory] = useState('T-shirt');
    const [subCategory, setSubCategory] = useState('');
    const [brand, setBrand] = useState('');

    // Pricing
    const [price, setPrice] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);

    // Inventory
    const [sku, setSku] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [weight, setWeight] = useState('');

    // Variants (Simple Implementation)
    const [variants, setVariants] = useState([]);
    const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: 0 });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const CATEGORY_DATA = {
        'T-shirt': ['Oversized', 'Round Neck', 'V-Neck', 'Polo', 'Slim Fit', 'Full Sleeve'],
        'Shirt': ['Casual', 'Formal', 'Half Sleeve', 'Full Sleeve', 'Denim'],
        'Hoodie': ['Pullover', 'Zip-up', 'Oversized', 'Fleece', 'Printed'],
        'Sweatshirts': ['Crew Neck', 'Drop Shoulder', 'Fleece', 'Regular'],
        'Panjabi': ['Traditional', 'Modern', 'Embroidered', 'Cotton', 'Silk'],
        'Shorts': ['Casual', 'Sports', 'Denim', 'Cargo', 'Bermuda'],
        'Baggy Pants': ['Cargo', 'Joggers', 'Street Style', 'Denim'],
        'Pants': ['Jeans', 'Chinos', 'Cargo', 'Joggers', 'Formal'],
        'Accessories': ['Hats', 'Socks', 'Belts', 'Bags', 'Wallets']
    };

    const CATEGORIES = Object.keys(CATEGORY_DATA);
    const [availableSubCategories, setAvailableSubCategories] = useState([]);

    useEffect(() => {
        setAvailableSubCategories(CATEGORY_DATA[category] || []);
        // Reset subCategory if it's not valid for the new category (unless loading initial data)
        if (!loading && !CATEGORY_DATA[category]?.includes(subCategory)) {
            setSubCategory('');
        }
    }, [category]);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`/products/${id}`);
                    setName(data.name);
                    setPrice(data.price);
                    setPurchasePrice(data.purchasePrice || 0);
                    setImage(data.images && data.images[0] ? data.images[0] : (data.image || ''));
                    setParentCategory(data.parentCategory || 'Men');
                    setCategory(data.category || 'T-shirt');
                    setSubCategory(data.subCategory || '');
                    setBrand(data.brand || '');
                    setWeight(data.weight || '');
                    setCountInStock(data.quantity);
                    setDescription(data.description);
                    setSku(data.sku);
                    setVariants(data.variants || []);
                    setLoading(false);
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to fetch product');
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleAddVariant = () => {
        if (newVariant.size && newVariant.color) {
            setVariants([...variants, newVariant]);
            setNewVariant({ size: '', color: '', stock: 0 });
        }
    };

    const handleRemoveVariant = (index) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const productData = {
            name,
            price: Number(price),
            purchasePrice: Number(purchasePrice),
            image,
            parentCategory,
            category,
            subCategory,
            brand,
            weight,
            countInStock: Number(countInStock),
            description,
            sku,
            variants
        };

        try {
            if (isEditMode) {
                await axios.put(`/products/${id}`, productData);
            } else {
                await axios.post('/products', productData);
            }
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/products" className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <ChevronLeft size={20} className="mr-1" />
                    Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? 'Edit Product' : 'Add Product'}
                </h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save size={18} className="mr-2" />
                    Save
                </button>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {loading && isEditMode && !name ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* General Info */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">General Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Media</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                                <div className="flex mt-1">
                                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="block w-full rounded-l-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-2 border" placeholder="https://..." />
                                    <button type="button" className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                                        <Upload size={18} />
                                    </button>
                                </div>
                                {image && (
                                    <div className="mt-2">
                                        <img src={image} alt="Product Preview" className="h-32 w-32 object-cover rounded-md border border-gray-300 dark:border-gray-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inventory & Shipping */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Inventory & Shipping</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                                    <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                                    <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                                    <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                                    <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2" />
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Variants</h3>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Size (e.g. XL)" value={newVariant.size} onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })} className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700" />
                                    <input type="text" placeholder="Color" value={newVariant.color} onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })} className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700" />
                                    <input type="number" placeholder="Qty" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })} className="w-24 rounded-md border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700" />
                                    <button type="button" onClick={handleAddVariant} className="bg-blue-100 text-blue-600 p-2 rounded-md hover:bg-blue-200">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {variants.map((v, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                                            <span className="text-sm dark:text-gray-200">{v.size} - {v.color} ({v.stock})</span>
                                            <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Organization & Pricing */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Pricing */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Pricing</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cost per item</label>
                                    <input type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2" />
                                    <p className="text-xs text-gray-500 mt-1">Customers won't see this</p>
                                </div>
                            </div>
                        </div>

                        {/* Organization */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Organization</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Category</label>
                                    <select value={parentCategory} onChange={(e) => setParentCategory(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2">
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub-Category</label>
                                    <select
                                        value={subCategory}
                                        onChange={(e) => setSubCategory(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                                        disabled={!category || availableSubCategories.length === 0}
                                    >
                                        <option value="">Select...</option>
                                        {availableSubCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductEdit;
