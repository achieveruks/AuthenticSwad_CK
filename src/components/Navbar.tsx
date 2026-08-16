import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useCart } from '../context/CartContext';
import { SearchBar } from './SearchBar';
import {
  ShoppingBag,
  Menu,
  X,
  Flame,
  Search,
  ChevronDown,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../data/products';

export const Navbar: React.FC = () => {
  const { currentRoute, goToHome, goToShop, goToCategories, goToAbout, goToContact } =
    useNavigation();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  const isActive = (path: string) => currentRoute.path === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top micro-announcement banner */}
      <div className="bg-gray-900 text-gray-300 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3" /> Special Offer
            </span>
            <span className="truncate">
              Use code <strong className="text-orange-400 font-bold">GAON15</strong> for 15% OFF • Free Delivery on orders over ₹499!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Kitchen Open: 11:30 AM – 11:30 PM</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>30-40 min Express Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={goToHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xs group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                  Gaon Ka <span className="text-orange-600">Swad</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block max-w-md w-full">
            <SearchBar />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1 text-sm font-medium">
            <button
              type="button"
              onClick={goToHome}
              className={`px-3 py-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive('/')
                  ? 'text-orange-600 border-orange-600 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => goToShop()}
              className={`px-3 py-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive('/shop')
                  ? 'text-orange-600 border-orange-600 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Shop
            </button>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
              onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={goToCategories}
                className={`px-3 py-5 text-sm font-medium transition-colors flex items-center gap-1 border-b-2 -mb-px ${
                  isActive('/categories')
                    ? 'text-orange-600 border-orange-600 font-semibold'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {isCategoriesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Our Specialties
                    </div>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setIsCategoriesDropdownOpen(false);
                          goToShop(cat.slug);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          {cat.itemCount}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCategoriesDropdownOpen(false);
                          goToCategories();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        View All Categories →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={goToAbout}
              className={`px-3 py-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive('/about')
                  ? 'text-orange-600 border-orange-600 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              About Us
            </button>

            <button
              type="button"
              onClick={goToContact}
              className={`px-3 py-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                isActive('/contact')
                  ? 'text-orange-600 border-orange-600 font-semibold'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              type="button"
              id="header-cart-button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full transition-colors flex items-center justify-center select-none"
              aria-label={`Open shopping cart with ${totalItemsCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Collapsible */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden pb-4 overflow-hidden"
            >
              <SearchBar autoFocus onClose={() => setIsSearchExpanded(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation Drawer / Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  goToHome();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  isActive('/') ? 'bg-orange-50 text-orange-600' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  goToShop();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  isActive('/shop') ? 'bg-orange-50 text-orange-600' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                Shop
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  goToCategories();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  isActive('/categories')
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                Categories
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  goToAbout();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  isActive('/about') ? 'bg-orange-50 text-orange-600' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                About Us
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  goToContact();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  isActive('/contact') ? 'bg-orange-50 text-orange-600' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                Contact
              </button>

              <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-2">
                <span>Kitchen Hotline</span>
                <a
                  href="tel:+919876543210"
                  className="font-bold text-orange-600 flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  +91 98765 43210
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
