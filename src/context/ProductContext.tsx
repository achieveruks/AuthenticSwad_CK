import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/products';
import {
  getProducts,
  getProductBySlug as apiGetProductBySlug,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  toggleProductActive as apiToggleActive,
  toggleProductStock as apiToggleStock,
} from '../lib/products';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  allProducts: Product[]; // Includes inactive for owner views
  activeProducts: Product[];
  featuredProducts: Product[];
  bestsellerProducts: Product[];
  newArrivals: Product[];
  chefSignatures: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string | number) => Product | undefined;
  
  // Owner Actions
  addProduct: (productData: Partial<Product>) => Promise<Product>;
  editProduct: (id: string | number, productData: Partial<Product>) => Promise<Product>;
  removeProduct: (id: string | number) => Promise<boolean>;
  toggleActive: (id: string | number) => Promise<Product>;
  toggleStock: (id: string | number) => Promise<Product>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // If owner is logged in, fetch all products including inactive
      const data = await getProducts(isAuthenticated, token || undefined);
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load products in ProductProvider:', err);
      setError('Could not load products. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  // Active customer-facing products
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.active !== false);
  }, [products]);

  // Featured items
  const featuredProducts = useMemo(() => {
    return activeProducts.filter((p) => p.featured);
  }, [activeProducts]);

  // Bestsellers
  const bestsellerProducts = useMemo(() => {
    return activeProducts.filter((p) => p.bestseller);
  }, [activeProducts]);

  // New arrivals
  const newArrivals = useMemo(() => {
    return activeProducts.filter((p) => p.newArrival);
  }, [activeProducts]);

  // Chef's special
  const chefSignatures = useMemo(() => {
    return activeProducts.filter((p) => p.chefSpecial);
  }, [activeProducts]);

  // Dynamic Categories with updated product counts
  const categories = useMemo(() => {
    return INITIAL_CATEGORIES.map((cat) => {
      const count = activeProducts.filter((p) => p.category === cat.id).length;
      return {
        ...cat,
        itemCount: count,
      };
    });
  }, [activeProducts]);

  const getProductBySlug = useCallback(
    (slug: string): Product | undefined => {
      if (!slug) return undefined;
      const cleanSlug = slug.toLowerCase().trim();
      return products.find((p) => p.slug.toLowerCase() === cleanSlug);
    },
    [products]
  );

  const getProductById = useCallback(
    (id: string | number): Product | undefined => {
      const idStr = String(id);
      return products.find((p) => String(p.id) === idStr);
    },
    [products]
  );

  // --- Owner Operations ---

  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Unauthorized: Owner token required');
    const created = await apiCreateProduct(productData, token);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const editProduct = async (id: string | number, productData: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Unauthorized: Owner token required');
    const updated = await apiUpdateProduct(id, productData, token);
    setProducts((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
    return updated;
  };

  const removeProduct = async (id: string | number): Promise<boolean> => {
    if (!token) throw new Error('Unauthorized: Owner token required');
    await apiDeleteProduct(id, token);
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    return true;
  };

  const toggleActive = async (id: string | number): Promise<Product> => {
    if (!token) throw new Error('Unauthorized: Owner token required');
    const updated = await apiToggleActive(id, token);
    setProducts((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
    return updated;
  };

  const toggleStock = async (id: string | number): Promise<Product> => {
    if (!token) throw new Error('Unauthorized: Owner token required');
    const updated = await apiToggleStock(id, token);
    setProducts((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
    return updated;
  };

  return (
    <ProductContext.Provider
      value={{
        products: activeProducts, // Customer-facing default
        allProducts: products, // Complete list for owner views
        activeProducts,
        featuredProducts,
        bestsellerProducts,
        newArrivals,
        chefSignatures,
        categories,
        isLoading,
        error,
        refreshProducts: fetchProductList,
        getProductBySlug,
        getProductById,
        addProduct,
        editProduct,
        removeProduct,
        toggleActive,
        toggleStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
