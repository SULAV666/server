/**
 * Express server entry — 3 Sister Collection API
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose'; // Added mongoose
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// 1. DATABASE CONNECTION
// This uses the MONGODB_URI you saved in Render's Environment Variables
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas - 3 Sister Database"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. MIDDLEWARE
app.use(cors()); // Allows your Netlify site to talk to this Render server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. ROUTES
// Root Route - Fixes the "Cannot GET /" error
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>🚀 3 Sister Collection API is Live</h1>
      <p>Database Status: Connected</p>
      <p>Use <b>/api/products</b> to view items.</p>
    </div>
  `);
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ 
  status: 'OK', 
  name: '3 Sister Collection API',
  database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
}));

// 4. ERROR HANDLING
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 3 Sister Collection API running on Port: ${PORT}`);
});
