require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors()); // allows the React app (different port) to call this API
app.use(express.json()); // parses JSON request bodies

// Health check — visit http://localhost:5000/api/v1/health in your browser
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'AuraGlow API is running.' });
});

// Module 1 routes
app.use('/api/v1/auth', authRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ AuraGlow backend running at http://localhost:${PORT}`);
});
