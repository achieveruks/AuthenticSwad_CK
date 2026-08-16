import React, { useState, useEffect } from 'react';
import { OwnerLayout } from './OwnerLayout';
import { useProducts } from '../../context/ProductContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../lib/products';
import { DashboardStats, Product } from '../../types';
import {
  UtensilsCrossed,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
  Layers,
  Edit2,
  Eye,
  EyeOff,
  PackageCheck,
  PackageX,
  RefreshCw,
} from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const { allProducts, toggleActive, toggleStock, refreshProducts } = useProducts();
  const { token } = useAuth();
  const { goToOwnerProducts, goToOwnerAddProduct, goToOwnerEditProduct } = useNavigation();

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: allProducts.length,
    activeProducts: allProducts.filter((p) => p.active !== false).length,
    outOfStockProducts: allProducts.filter((p) => p.inStock === false).length,
    featuredProducts: allProducts.filter((p) => p.featured && p.active !== false).length,
    bestsellerProducts: allProducts.filter((p) => p.bestseller && p.active !== false).length,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  // Sync stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      setLoadingStats(true);
      try {
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (err) {
        console.warn('Using computed stats fallback:', err);
        setStats({
          totalProducts: allProducts.length,
          activeProducts: allProducts.filter((p) => p.active !== false).length,
          outOfStockProducts: allProducts.filter((p) => p.inStock === false).length,
          featuredProducts: allProducts.filter((p) => p.featured && p.active !== false).length,
          bestsellerProducts: allProducts.filter((p) => p.bestseller && p.active !== false).length,
        });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [token, allProducts]);

  const handleToggleActive = async (id: string | number) => {
    setActionLoadingId(id);
    try {
      await toggleActive(id);
    } catch (err) {
      console.error('Failed to toggle active status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStock = async (id: string | number) => {
    setActionLoadingId(id);
    try {
      await toggleStock(id);
    } catch (err) {
      console.error('Failed to toggle stock status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const recentProducts = allProducts.slice(0, 6);

  return (
    <OwnerLayout
      activeTab="dashboard"
      title="Owner Dashboard"
      subtitle="Overview of cloud kitchen live catalog, inventory stock, and merchandising."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshProducts()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${loadingStats ? 'animate-spin' : ''}`} />
            <span>Sync Catalog</span>
          </button>
          <button
            type="button"
            onClick={goToOwnerAddProduct}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      }
    >
      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-950">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Dishes in database</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Active Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {stats.activeProducts}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Visible on store</span>
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              {stats.outOfStockProducts}
            </span>
            <span className="text-[11px] text-amber-600 font-semibold">Orders paused</span>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Featured Items
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-700">
              {stats.featuredProducts}
            </span>
            <span className="text-[11px] text-purple-600 font-semibold">Homepage spotlight</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-600 to-amber-700 text-white rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Create New Dish</h3>
            <p className="text-xs text-orange-100 mt-0.5">
              Add a new biryani, curry, starter, bread or dessert to the menu.
            </p>
          </div>
          <button
            type="button"
            onClick={goToOwnerAddProduct}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-orange-900 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <span>Launch Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-gray-900">Manage Catalog</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Filter by category, edit prices, toggle items active/inactive, or delete dishes.
            </p>
          </div>
          <button
            type="button"
            onClick={goToOwnerProducts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>View All {allProducts.length} Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-gray-900">Live Architecture</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Persistent product store synced with server API and customer storefront.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Store Synced
            </span>
            <span className="text-[11px] text-gray-400">Vercel Ready</span>
          </div>
        </div>
      </div>

      {/* 3. Recent Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base text-gray-900">
              Recent Menu Items
            </h2>
            <p className="text-xs text-gray-500">
              Quickly toggle stock availability and store visibility.
            </p>
          </div>
          <button
            type="button"
            onClick={goToOwnerProducts}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Table on Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock Status</th>
                <th className="py-3 px-3">Store Visibility</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {recentProducts.map((product) => {
                const isItemLoading = actionLoadingId === product.id;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Dish name & thumb */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">/{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900">₹{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </div>
                      )}
                    </td>

                    {/* In Stock toggle */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        disabled={isItemLoading}
                        onClick={() => handleToggleStock(product.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          product.inStock !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle Stock Status"
                      >
                        {product.inStock !== false ? (
                          <>
                            <PackageCheck className="w-3 h-3 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <PackageX className="w-3 h-3 text-amber-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Active toggle */}
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        disabled={isItemLoading}
                        onClick={() => handleToggleActive(product.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          product.active !== false
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                        title="Click to toggle Store Visibility"
                      >
                        {product.active !== false ? (
                          <>
                            <Eye className="w-3 h-3 text-blue-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-gray-500" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => goToOwnerEditProduct(product.id)}
                        className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold px-2 py-1 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden divide-y divide-gray-100">
          {recentProducts.map((product) => (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-xs truncate">{product.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{product.category}</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">₹{product.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => goToOwnerEditProduct(product.id)}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleToggleStock(product.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border ${
                    product.inStock !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {product.inStock !== false ? <PackageCheck className="w-3 h-3" /> : <PackageX className="w-3 h-3" />}
                  <span>{product.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleActive(product.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border ${
                    product.active !== false
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {product.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{product.active !== false ? 'Active' : 'Inactive'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
};
