/**
 * Simple JSON file-based database for 3 Sister Collection.
 * No native dependencies required — pure JavaScript.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.json');

/* ── Load or initialize database ── */
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('DB load error, reinitializing:', e.message);
  }
  return { products: [], admin: [] };
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

let db = loadDB();

/* ── Seed admin account ── */
if (!db.admin.find(a => a.username === '3SisterAdmin')) {
  db.admin.push({
    id: nanoid(),
    username: '3SisterAdmin',
    password_hash: bcrypt.hashSync('3SisterAdmin', 10)
  });
  console.log('✅ Admin account seeded (username: 3SisterAdmin)');
}

/* ── Seed products ── */
if (db.products.length === 0) {
  const seedProducts = [
    {
      id: nanoid(), name: 'Royal Banarasi Silk Saree', price: 12500,
      description: 'Exquisite handwoven Banarasi silk saree with intricate gold zari work. Features traditional motifs with a rich pallu. Perfect for weddings and festive occasions.',
      category: 'Sarees', sizes: ['Free Size'], image: 'banarasi-silk.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Elegant Georgette Saree', price: 4500,
      description: 'Lightweight and flowing georgette saree ideal for daily wear and casual gatherings. Features delicate printed patterns with a contrasting border.',
      category: 'Sarees', sizes: ['Free Size'], image: 'georgette-saree.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Modern Pre-Draped Saree', price: 7800,
      description: 'Trending 2026 pre-draped saree for the modern woman. No draping hassle — just wear and go! Comes with pre-stitched pleats and pallu.',
      category: 'Sarees', sizes: ['S', 'M', 'L', 'XL'], image: 'pre-draped-saree.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Embroidered Kurti Set', price: 3500,
      description: 'Beautiful hand-embroidered cotton kurti with matching palazzo pants and dupatta. Comfortable yet stylish for everyday elegance.',
      category: 'Kurta Sets', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: 'embroidered-kurti.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Designer Palazzo Suit', price: 5200,
      description: 'Premium palazzo suit with intricate mirror work and thread embroidery. Flowy palazzo pants paired with a fitted kurta and chiffon dupatta.',
      category: 'Kurta Sets', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: 'palazzo-suit.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Festive Sharara Set', price: 6800,
      description: 'Gorgeous sharara set with flared pants and a short kurta. Heavy sequin and zardozi work make this perfect for parties and festivals.',
      category: 'Kurta Sets', sizes: ['S', 'M', 'L', 'XL'], image: 'sharara-set.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Bridal Lehenga Choli', price: 25000,
      description: 'Stunning bridal lehenga in deep red with gold embroidery. Heavy dupatta with embellished border. A dream outfit for your special day.',
      category: 'Lehenga Choli', sizes: ['S', 'M', 'L', 'XL'], image: 'bridal-lehenga.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Indo-Western Crop Top Lehenga', price: 15500,
      description: 'Modern Indo-Western lehenga with a crop-top blouse and flared skirt. Contemporary design meets traditional elegance. Great for sangeet and reception.',
      category: 'Lehenga Choli', sizes: ['XS', 'S', 'M', 'L', 'XL'], image: 'indo-western-lehenga.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Traditional Guneu Choli', price: 8500,
      description: 'Authentic Nepali Guneu Choli set in vibrant colors. Handcrafted with traditional patterns that celebrate Nepali heritage and femininity.',
      category: 'Nepali Cultural Wear', sizes: ['S', 'M', 'L', 'XL'], image: 'guneu-choli.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Daura Suruwal (Women/Kids)', price: 6200,
      description: "Elegant women's and kids' Daura Suruwal reimagined with modern fabrics. Perfect for Dashain, Tihar, and cultural celebrations.",
      category: 'Nepali Cultural Wear', sizes: ['S', 'M', 'L', 'XL'], image: 'daura-suruwal.webp', in_stock: true,
      created_at: new Date().toISOString()
    },
    {
      id: nanoid(), name: 'Heritage Bhaku', price: 9800,
      description: 'Traditional Newari Bhaku with intricate weaving. A timeless piece of Nepali cultural fashion, perfect for Jatras and special ceremonies.',
      category: 'Nepali Cultural Wear', sizes: ['S', 'M', 'L', 'XL'], image: 'bhaku.webp', in_stock: true,
      created_at: new Date().toISOString()
    }
  ];

  db.products = seedProducts;
  console.log(`✅ Seeded ${seedProducts.length} products`);
}

saveDB(db);

/* ── Public API ── */
export function getDB() { return db; }

export function getAllProducts(category) {
  let items = [...db.products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  if (category && category !== 'All') {
    items = items.filter(p => p.category === category);
  }
  return items;
}

export function getProductById(id) {
  return db.products.find(p => p.id === id) || null;
}

export function createProduct(data) {
  const product = {
    id: nanoid(),
    name: data.name,
    price: parseFloat(data.price),
    description: data.description || '',
    category: data.category,
    sizes: data.sizes || [],
    image: data.image || null,
    in_stock: data.in_stock !== false,
    created_at: new Date().toISOString()
  };
  db.products.push(product);
  saveDB(db);
  return product;
}

export function updateProduct(id, data) {
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const existing = db.products[idx];
  db.products[idx] = {
    ...existing,
    name: data.name ?? existing.name,
    price: data.price !== undefined ? parseFloat(data.price) : existing.price,
    description: data.description !== undefined ? data.description : existing.description,
    category: data.category ?? existing.category,
    sizes: data.sizes ?? existing.sizes,
    image: data.image ?? existing.image,
    in_stock: data.in_stock !== undefined ? data.in_stock : existing.in_stock
  };
  saveDB(db);
  return db.products[idx];
}

export function toggleStock(id) {
  const product = db.products.find(p => p.id === id);
  if (!product) return null;
  product.in_stock = !product.in_stock;
  saveDB(db);
  return product;
}

export function deleteProductById(id) {
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const removed = db.products.splice(idx, 1)[0];
  saveDB(db);
  return removed;
}

export function findAdmin(username) {
  return db.admin.find(a => a.username === username) || null;
}
