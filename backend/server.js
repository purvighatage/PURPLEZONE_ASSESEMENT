const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDbMode } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database (with failover mock mode)
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/statements', require('./routes/statements'));

// Root Endpoint - Status Information
app.get('/', (req, res) => {
  const isMock = getDbMode();
  res.json({
    name: 'PurpleZone Grammar Checker API',
    version: '1.0.0',
    status: 'online',
    databaseMode: isMock ? 'In-Memory / Mock DB Fallback' : 'MongoDB (Live Connection)',
    endpoints: [
      { path: '/api/auth/register', method: 'POST', access: 'Public' },
      { path: '/api/auth/login', method: 'POST', access: 'Public' },
      { path: '/api/auth/me', method: 'GET', access: 'Private' },
      { path: '/api/statements', method: 'GET', access: 'Private' },
      { path: '/api/statements/submit', method: 'POST', access: 'Private' }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`PurpleZone Backend running on port ${PORT}`);
  console.log(`Database Mode: ${getDbMode() ? 'In-Memory / Mock DB Fallback' : 'MongoDB (Live Connection)'}`);
  console.log(`==================================================`);
});
