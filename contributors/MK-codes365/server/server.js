const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const emailIngestionRoutes = require('./src/routes/emailIngestion');

// Basic Route for Verification
app.get('/', (req, res) => {
    res.send('SubSentry Backend is Running...');
});

// Mount Routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/email', emailIngestionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
