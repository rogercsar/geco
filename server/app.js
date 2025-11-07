const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { createSimulationPayment } = require('./controllers/payments');

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
const payments = require('./routes/payments');
app.use('/api/v1/auth', auth);
app.use('/api/v1/budgets', budgets);
app.use('/api/v1/payments', payments);
app.post('/api/mp/create-preference', createSimulationPayment);

module.exports = app;