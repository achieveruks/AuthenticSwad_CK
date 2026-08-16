import React from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CategoriesPage } from './pages/CategoriesPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useNavigation();
  const { isCartDrawerOpen, setIsCartDrawerOpen } = useCart();

  // Page Routing Logic
  const renderCurrentPage = () => {
    switch (currentRoute.path) {
      case '/':
        return <HomePage />;
      case '/shop':
        return <ShopPage />;
      case '/categories':
        return <CategoriesPage />;
      case '/product':
        return <ProductDetailPage slug={currentRoute.slug || 'nizami-royal-dum-mutton-biryani'} />;
      case '/cart':
        return <CartPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#1F2937] selection:bg-orange-600 selection:text-white">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer Slideout */}
      <CartDrawer />

      {/* Dynamic Toast Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </NavigationProvider>
  );
}
