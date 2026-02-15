import axios from '../api/axios';

// Register user
export const register = async (userData) => {
    try {
        const response = await axios.post('/auth/register', userData);

        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
};

// Login user
export const login = async (userData) => {
    try {
        const response = await axios.post('/auth/login', userData);

        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
};

// Logout user
export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
};
