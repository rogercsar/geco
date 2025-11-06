const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
const auth = require('./routes/auth');
const budgets = require('./routes/budgets');
app.use('/api/v1/auth', auth);
app.use('/api/v1/budgets', budgets);

module.exports = app;