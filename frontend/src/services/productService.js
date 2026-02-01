import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';

// Get all products
export const getAllProducts = async () => {
    try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);

        const products = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get product by ID
export const getProductById = async (id) => {
    try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            return {
                _id: productSnap.id,
                ...productSnap.data()
            };
        } else {
            throw new Error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Get products by category
export const getProductsByCategory = async (category) => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('category', '==', category));
        const snapshot = await getDocs(q);

        const products = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return products;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

// Get featured products
export const getFeaturedProducts = async (limitCount = 8) => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, limit(limitCount));
        const snapshot = await getDocs(q);

        const products = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return products;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        throw error;
    }
};
