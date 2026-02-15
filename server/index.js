const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const connectDB = require('./config/db'); // Firebase init happens inside models/controllers via config/db

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database (Firebase initialized on first use)

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Routes
// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/stats', statsRoutes);
app.use('/categories', categoryRoutes);
app.use('/settings', settingsRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Local Development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Cloud Functions (V2)
const { onRequest } = require('firebase-functions/v2/https');
exports.api = onRequest({ cors: true, invoker: 'public' }, app);
