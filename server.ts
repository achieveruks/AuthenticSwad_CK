import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { productStorage } from './server/storage';
import {
  createSessionToken,
  verifySessionToken,
  validateOwnerCredentials,
  requireOwnerAuth,
  AuthenticatedRequest,
} from './server/auth';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Middlewares
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // --- API Routes ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Auth: Owner Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
      }

      const isValid = validateOwnerCredentials(email, password);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Please verify your email and password.',
        });
      }

      const token = createSessionToken(email, 'owner');
      return res.json({
        success: true,
        token,
        user: {
          email: email.toLowerCase().trim(),
          role: 'owner',
          name: 'Kitchen Owner',
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({
        success: false,
        error: 'An internal error occurred during authentication.',
      });
    }
  });

  // 2. Auth: Verify Session
  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifySessionToken(token);

    if (!payload) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session token' });
    }

    return res.json({
      success: true,
      user: {
        email: payload.email,
        role: payload.role,
        name: 'Kitchen Owner',
      },
    });
  });

  // 3. Auth: Logout
  app.post('/api/auth/logout', (req, res) => {
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // 4. Products: List All
  app.get('/api/products', (req, res) => {
    try {
      const includeInactiveParam = req.query.includeInactive === 'true';
      let includeInactive = false;

      if (includeInactiveParam) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          const payload = verifySessionToken(token);
          if (payload) {
            includeInactive = true;
          }
        }
      }

      const products = productStorage.getAll(includeInactive);
      return res.json({ success: true, products, count: products.length });
    } catch (err: any) {
      console.error('Fetch products error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
  });

  // 5. Products: Single Item by ID or Slug
  app.get('/api/products/:idOrSlug', (req, res) => {
    try {
      const { idOrSlug } = req.params;
      let product = productStorage.getById(idOrSlug);
      if (!product) {
        product = productStorage.getBySlug(idOrSlug);
      }

      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      return res.json({ success: true, product });
    } catch (err: any) {
      console.error('Fetch product detail error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
  });

  // 6. Products: Create (Protected)
  app.post('/api/products', requireOwnerAuth, (req: AuthenticatedRequest, res) => {
    try {
      const product = productStorage.create(req.body);
      return res.status(201).json({ success: true, product });
    } catch (err: any) {
      console.error('Create product error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Failed to create product. Please check form values.',
      });
    }
  });

  // 7. Products: Update (Protected)
  app.put('/api/products/:id', requireOwnerAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updated = productStorage.update(id, req.body);

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found for update' });
      }

      return res.json({ success: true, product: updated });
    } catch (err: any) {
      console.error('Update product error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Failed to update product',
      });
    }
  });

  // 8. Products: Delete (Protected)
  app.delete('/api/products/:id', requireOwnerAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = productStorage.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Product not found to delete' });
      }

      return res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err: any) {
      console.error('Delete product error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  });

  // 9. Products: Quick Toggle Active Status (Protected)
  app.patch('/api/products/:id/toggle-active', requireOwnerAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updated = productStorage.toggleActive(id);

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      return res.json({ success: true, product: updated });
    } catch (err: any) {
      console.error('Toggle active error:', err);
      return res.status(500).json({ success: false, error: 'Failed to toggle product status' });
    }
  });

  // 10. Products: Quick Toggle Stock Status (Protected)
  app.patch('/api/products/:id/toggle-stock', requireOwnerAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updated = productStorage.toggleStock(id);

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      return res.json({ success: true, product: updated });
    } catch (err: any) {
      console.error('Toggle stock error:', err);
      return res.status(500).json({ success: false, error: 'Failed to toggle stock status' });
    }
  });

  // 11. Owner Dashboard Stats (Protected)
  app.get('/api/stats', requireOwnerAuth, (req: AuthenticatedRequest, res) => {
    try {
      const stats = productStorage.getStats();
      return res.json({ success: true, stats });
    } catch (err: any) {
      console.error('Dashboard stats error:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve stats' });
    }
  });

  // --- Vite Dev Middleware or Static Production Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gaon Ka Swad server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
