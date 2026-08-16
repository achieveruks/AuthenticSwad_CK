import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  LogOut,
  ExternalLink,
  ChefHat,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

interface OwnerLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'products' | 'new-product' | 'edit-product';
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const OwnerLayout: React.FC<OwnerLayoutProps> = ({
  children,
  activeTab,
  title,
  subtitle,
  actions,
}) => {
  const { isAuthenticated, isLoading, ownerUser, logout } = useAuth();
  const {
    goToOwnerDashboard,
    goToOwnerProducts,
    goToOwnerAddProduct,
    goToOwnerLogin,
    goToHome,
  } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Protected Route Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      goToOwnerLogin();
    }
  }, [isAuthenticated, isLoading, goToOwnerLogin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-600">Verifying Owner Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    goToOwnerLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Owner Navigation Header */}
      <header className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Portal Badge */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToOwnerDashboard}
                className="flex items-center gap-2.5 group text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:bg-orange-500 transition-colors">
                  G
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight text-white">
                      Gaon Ka Swad
                    </span>
                    <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                      Owner
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">Kitchen Product Management</p>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={goToOwnerDashboard}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={goToOwnerProducts}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'products' || activeTab === 'edit-product'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Products</span>
              </button>

              <button
                type="button"
                onClick={goToOwnerAddProduct}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'new-product'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </nav>

            {/* Right Controls: User info, View Site, Logout */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={goToHome}
                className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg border border-gray-700 transition-colors cursor-pointer"
                title="View customer-facing storefront"
              >
                <ExternalLink className="w-3 h-3 text-gray-400" />
                <span>Live Website</span>
              </button>

              <div className="h-4 w-px bg-gray-800" />

              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="text-[11px] text-gray-400 truncate max-w-[140px]">
                  {ownerUser?.email || 'achieveruks@gmail.com'}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-900/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-800 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  goToOwnerDashboard();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  goToOwnerProducts();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeTab === 'products' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>All Products</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  goToOwnerAddProduct();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeTab === 'new-product' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Product</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  goToHome();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:bg-gray-800"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Live Storefront</span>
              </button>

              <div className="pt-2 border-t border-gray-800 flex items-center justify-between px-3">
                <span className="text-[11px] text-gray-400 truncate">
                  {ownerUser?.email || 'achieveruks@gmail.com'}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-rose-400 py-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
        </div>

        {/* Content Body */}
        {children}
      </main>
    </div>
  );
};
