const axios = require('axios');

async function testLogin() {
    const url = 'https://us-central1-newbuy.cloudfunctions.net/api/auth/login';
    const email = 'saifulislam786452@gmail.com';
    const password = '123456';

    console.log(`Attempting login to: ${url}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    try {
        const response = await axios.post(url, {
            email: email,
            password: password
        });

        console.log('------------------------------------------------');
        console.log('LOGIN SUCCESS! ✅');
        console.log('Token received:', response.data.token ? 'Yes' : 'No');
        console.log('User Role:', response.data.role);
        console.log('------------------------------------------------');
    } catch (error) {
        console.log('------------------------------------------------');
        console.log('LOGIN FAILED ❌');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
        console.log('------------------------------------------------');
    }
}

testLogin();
