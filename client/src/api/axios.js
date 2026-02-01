import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Interceptor to add token to requests
instance.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
