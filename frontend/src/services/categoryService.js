import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Get all categories
export const getAllCategories = async () => {
    try {
        const categoriesRef = collection(db, 'categories');
        const snapshot = await getDocs(categoriesRef);

        const categories = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
