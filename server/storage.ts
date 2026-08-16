import fs from 'fs';
import path from 'path';
import { Product, DashboardStats } from '../src/types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../src/data/products';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'products_store.json');

class ProductStorage {
  private products: Product[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize products to have active and inStock defaults
          this.products = parsed.map((p) => ({
            ...p,
            active: p.active !== false,
            inStock: p.inStock !== false,
          }));
          this.isInitialized = true;
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read existing products store, falling back to initial seed:', err);
    }

    // Seed from initial products
    this.products = INITIAL_PRODUCTS.map((p) => ({
      ...p,
      active: p.active !== false,
      inStock: p.inStock !== false,
    }));

    this.saveToDisk();
    this.isInitialized = true;
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write products to disk:', err);
    }
  }

  public getAll(includeInactive = false): Product[] {
    this.init();
    if (includeInactive) {
      return [...this.products];
    }
    return this.products.filter((p) => p.active !== false);
  }

  public getById(id: string | number): Product | undefined {
    this.init();
    const idStr = String(id);
    return this.products.find((p) => String(p.id) === idStr);
  }

  public getBySlug(slug: string): Product | undefined {
    this.init();
    const cleanSlug = slug.toLowerCase().trim();
    return this.products.find((p) => p.slug.toLowerCase() === cleanSlug);
  }

  public create(data: Partial<Product>): Product {
    this.init();

    // Validate required fields
    if (!data.name || !data.name.trim()) {
      throw new Error('Product name is required');
    }
    if (data.price === undefined || isNaN(Number(data.price)) || Number(data.price) <= 0) {
      throw new Error('Valid positive price is required');
    }
    if (!data.category) {
      throw new Error('Category is required');
    }

    // Generate unique slug
    let baseSlug = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    if (!baseSlug) baseSlug = 'product';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (this.products.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Generate unique ID
    const maxNumId = this.products.reduce((max, p) => {
      const num = typeof p.id === 'number' ? p.id : parseInt(String(p.id).replace(/\D/g, ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 100);
    const newId = maxNumId + 1;

    const newProduct: Product = {
      id: newId,
      name: data.name.trim(),
      hindiName: data.hindiName?.trim() || undefined,
      slug: uniqueSlug,
      shortDescription: data.shortDescription?.trim() || data.description?.slice(0, 100) || '',
      description: data.description?.trim() || '',
      story: data.story?.trim() || undefined,
      culinaryTitle: data.culinaryTitle?.trim() || undefined,
      cookingMethodTitle: data.cookingMethodTitle?.trim() || undefined,
      cookingMethodDesc: data.cookingMethodDesc?.trim() || undefined,
      aromaTitle: data.aromaTitle?.trim() || undefined,
      aromaDesc: data.aromaDesc?.trim() || undefined,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      category: data.category,
      rating: data.rating ? Number(data.rating) : 4.8,
      reviewsCount: data.reviewsCount ? Number(data.reviewsCount) : 1,
      image: data.image?.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
      galleryImages: data.galleryImages && data.galleryImages.length > 0 ? data.galleryImages : [data.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'],
      isVeg: data.isVeg !== false,
      isJainFriendly: !!data.isJainFriendly,
      spiceLevel: data.spiceLevel || 'Medium',
      prepTimeMinutes: data.prepTimeMinutes ? Number(data.prepTimeMinutes) : 30,
      serves: data.serves?.trim() || 'Serves 1-2',
      calories: data.calories ? Number(data.calories) : undefined,
      featured: !!data.featured,
      bestseller: !!data.bestseller,
      newArrival: data.newArrival !== undefined ? !!data.newArrival : true,
      chefSpecial: !!data.chefSpecial,
      active: data.active !== false,
      inStock: data.inStock !== false,
      ingredients: Array.isArray(data.ingredients) && data.ingredients.length > 0
        ? data.ingredients
        : ['Pure Cow Ghee', 'Heirloom Spices', 'Fresh Ingredients'],
      allergens: data.allergens || [],
      variants: data.variants || [],
      addons: data.addons || [],
      reviewsList: data.reviewsList || [],
    };

    // Add to list and save
    this.products.unshift(newProduct);
    this.saveToDisk();
    return newProduct;
  }

  public update(id: string | number, data: Partial<Product>): Product | null {
    this.init();
    const idStr = String(id);
    const index = this.products.findIndex((p) => String(p.id) === idStr);
    if (index === -1) return null;

    const existing = this.products[index];

    // Check slug uniqueness if slug changed
    if (data.slug && data.slug !== existing.slug) {
      const cleanSlug = data.slug.toLowerCase().trim();
      const duplicate = this.products.find(
        (p) => String(p.id) !== idStr && p.slug.toLowerCase() === cleanSlug
      );
      if (duplicate) {
        throw new Error(`Slug "${data.slug}" is already in use by another product`);
      }
    }

    const updated: Product = {
      ...existing,
      ...data,
      id: existing.id, // Immutable ID
      name: data.name !== undefined ? data.name.trim() : existing.name,
      slug: data.slug !== undefined ? data.slug.toLowerCase().trim() : existing.slug,
      price: data.price !== undefined ? Number(data.price) : existing.price,
      originalPrice: data.originalPrice !== undefined ? (data.originalPrice ? Number(data.originalPrice) : undefined) : existing.originalPrice,
      category: data.category !== undefined ? data.category : existing.category,
      active: data.active !== undefined ? !!data.active : existing.active !== false,
      inStock: data.inStock !== undefined ? !!data.inStock : existing.inStock !== false,
      featured: data.featured !== undefined ? !!data.featured : existing.featured,
      bestseller: data.bestseller !== undefined ? !!data.bestseller : existing.bestseller,
      image: data.image !== undefined ? data.image.trim() : existing.image,
      description: data.description !== undefined ? data.description.trim() : existing.description,
      shortDescription: data.shortDescription !== undefined ? data.shortDescription.trim() : existing.shortDescription,
      story: data.story !== undefined ? (data.story ? data.story.trim() : undefined) : existing.story,
      culinaryTitle: data.culinaryTitle !== undefined ? (data.culinaryTitle ? data.culinaryTitle.trim() : undefined) : existing.culinaryTitle,
      cookingMethodTitle: data.cookingMethodTitle !== undefined ? (data.cookingMethodTitle ? data.cookingMethodTitle.trim() : undefined) : existing.cookingMethodTitle,
      cookingMethodDesc: data.cookingMethodDesc !== undefined ? (data.cookingMethodDesc ? data.cookingMethodDesc.trim() : undefined) : existing.cookingMethodDesc,
      aromaTitle: data.aromaTitle !== undefined ? (data.aromaTitle ? data.aromaTitle.trim() : undefined) : existing.aromaTitle,
      aromaDesc: data.aromaDesc !== undefined ? (data.aromaDesc ? data.aromaDesc.trim() : undefined) : existing.aromaDesc,
    };

    this.products[index] = updated;
    this.saveToDisk();
    return updated;
  }

  public delete(id: string | number): boolean {
    this.init();
    const idStr = String(id);
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => String(p.id) !== idStr);
    const deleted = this.products.length < initialLen;
    if (deleted) {
      this.saveToDisk();
    }
    return deleted;
  }

  public toggleActive(id: string | number): Product | null {
    this.init();
    const product = this.getById(id);
    if (!product) return null;
    return this.update(id, { active: product.active === false });
  }

  public toggleStock(id: string | number): Product | null {
    this.init();
    const product = this.getById(id);
    if (!product) return null;
    return this.update(id, { inStock: product.inStock === false });
  }

  public getStats(): DashboardStats {
    this.init();
    const totalProducts = this.products.length;
    const activeProducts = this.products.filter((p) => p.active !== false).length;
    const outOfStockProducts = this.products.filter((p) => p.inStock === false).length;
    const featuredProducts = this.products.filter((p) => p.featured && p.active !== false).length;
    const bestsellerProducts = this.products.filter((p) => p.bestseller && p.active !== false).length;

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      featuredProducts,
      bestsellerProducts,
    };
  }
}

export const productStorage = new ProductStorage();
