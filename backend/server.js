require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Connection
let isMongoDBConnected = false;

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/providence_ecommerce';
console.log('Connecting to database URI:', mongoUri);

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000 // fail fast if not running
})
.then(() => {
  isMongoDBConnected = true;
  console.log('Successfully connected to MongoDB.');
})
.catch((err) => {
  isMongoDBConnected = false;
  console.warn('----------------------------------------------------');
  console.warn('WARNING: MongoDB is not running or failed to connect.');
  console.warn('The application is running in STANDALONE fallback mode.');
  console.warn('All data will be saved locally to: ./db.json');
  console.warn('----------------------------------------------------');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check / welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Providence Ecommerce API',
    status: 'online',
    databaseMode: isMongoDBConnected ? 'MongoDB (Production)' : 'JSON File Fallback (Standalone Local Dev)',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
