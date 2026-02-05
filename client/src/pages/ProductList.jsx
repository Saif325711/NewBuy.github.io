import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchProducts = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/products?pageNumber=${pageNumber}`);
            setProducts(data.products);
            setPage(data.page);
            setPages(data.pages);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/products/${id}`);
                fetchProducts(page);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/categories', { name: newCategoryName });
            alert('Category Created Successfully');
            setShowCategoryModal(false);
            setNewCategoryName('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create category');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowCategoryModal(true)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        <Plus size={20} className="mr-2" />
                        New Category
                    </button>
                    <Link
                        to="/products/new"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Category</h2>
                        <form onSubmit={handleCreateCategory}>
                            <input
                                type="text"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-4 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Category Name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4 dark:text-gray-300">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="text-center py-4 text-red-500">{error}</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4 dark:text-gray-300">No products found</td></tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {product.images && product.images[0] ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                            <span className="text-sm font-bold text-gray-500">Img</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            ${product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {product.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/products/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                <Edit2 size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination (Simplified) */}
            <div className="flex justify-center mt-4 space-x-2">
                {[...Array(pages).keys()].map(x => (
                    <button
                        key={x + 1}
                        onClick={() => setPage(x + 1)}
                        className={`px-3 py-1 rounded-md ${page === x + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {x + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
