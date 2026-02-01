const axios = require('axios');

const verifyApiLogin = async () => {
    try {
        console.log('Testing API Login Endpoint...');
        const loginUrl = 'http://localhost:5000/api/auth/login';
        const payload = {
            email: 'saifulislam786452@gmail.com',
            password: '987654321'
        };

        const response = await axios.post(loginUrl, payload);
        console.log('API Response Status:', response.status);
        console.log('Login Successful! Token received.');

        const token = response.data.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        console.log('Testing Protected Route (Get Profile)...');
        const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', config); // Profile is protected
        console.log('Profile Response Status:', profileResponse.status);
        console.log('Protected Route Access Successful!');
        console.log('User Role:', profileResponse.data.role);

    } catch (error) {
        console.log('API Request Failed');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error Message:', error.message);
        }
    }
};

verifyApiLogin();
