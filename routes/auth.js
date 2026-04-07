/**
 * Admin authentication route — POST /api/auth/login
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { findAdmin } from '../db.js';
import { generateToken } from '../auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = findAdmin(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = bcrypt.compareSync(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(admin);
    res.json({
      token,
      username: admin.username,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

export default router;
