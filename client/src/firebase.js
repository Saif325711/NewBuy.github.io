import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4MXHHZnOoT8KyhiaqMLxhDp3T-O9JH0Y",
    authDomain: "newbuy.firebaseapp.com",
    projectId: "newbuy",
    storageBucket: "newbuy.firebasestorage.app",
    messagingSenderId: "472822254421",
    appId: "1:472822254421:web:e37c2f7e36f88e7271fddc",
    measurementId: "G-RTP9JMEQ38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
