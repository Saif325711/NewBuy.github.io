import axios from 'axios';

const instance = axios.create({
    // Hardcoding the production URL to ensure we hit the live backend
    baseURL: 'https://us-central1-newbuy.cloudfunctions.net/api',
});

export default instance;
