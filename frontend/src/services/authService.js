// Use environment variable for API URL in production, or fallback to relative path for local proxy
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/auth';

// Register user
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error('JSON Parse Error:', err);
        console.error('Response Text:', text);
        throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    if (data.token) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    return data;
};

// Login user
export const login = async (userData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error('JSON Parse Error:', err);
        console.error('Response Text:', text);
        throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    return data;
};

// Logout user
export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
};
