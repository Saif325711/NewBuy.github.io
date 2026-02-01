// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC4MXHHZnOoT8KyhiaqMLxhDp3T-O9JH0Y",
    authDomain: "newbuy.firebaseapp.com",
    projectId: "newbuy",
    storageBucket: "newbuy.firebasestorage.app",
    messagingSenderId: "472822254421",
    appId: "1:472822254421:web:475867d04f095d7a71fddc",
    measurementId: "G-60VNZX9SX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
