import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | { path: '/' }
  | { path: '/shop'; category?: string; search?: string }
  | { path: '/categories' }
  | { path: '/product'; slug: string }
  | { path: '/cart' }
  | { path: '/checkout' }
  | { path: '/about' }
  | { path: '/contact' }
  | { path: '/order-success'; orderId: string };

interface NavigationContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  goToHome: () => void;
  goToShop: (category?: string, search?: string) => void;
  goToProduct: (slug: string) => void;
  goToCart: () => void;
  goToCheckout: () => void;
  goToAbout: () => void;
  goToContact: () => void;
  goToCategories: () => void;
  goToOrderSuccess: (orderId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Helper to parse route from URL hash
function parseHash(hash: string): AppRoute {
  const cleanHash = hash.replace(/^#\/?/, '');
  if (!cleanHash || cleanHash === '') return { path: '/' };

  const [main, queryString] = cleanHash.split('?');
  const params = new URLSearchParams(queryString || '');

  if (main === 'shop') {
    return {
      path: '/shop',
      category: params.get('category') || undefined,
      search: params.get('search') || undefined
    };
  }

  if (main === 'categories') {
    return { path: '/categories' };
  }

  if (main.startsWith('product/')) {
    const slug = main.replace('product/', '');
    return { path: '/product', slug };
  }

  if (main === 'cart') return { path: '/cart' };
  if (main === 'checkout') return { path: '/checkout' };
  if (main === 'about') return { path: '/about' };
  if (main === 'contact') return { path: '/contact' };

  if (main.startsWith('order-success/')) {
    const orderId = main.replace('order-success/', '');
    return { path: '/order-success', orderId };
  }

  return { path: '/' };
}

function routeToHash(route: AppRoute): string {
  switch (route.path) {
    case '/':
      return '#/';
    case '/shop': {
      const params = new URLSearchParams();
      if (route.category) params.set('category', route.category);
      if (route.search) params.set('search', route.search);
      const str = params.toString();
      return str ? `#/shop?${str}` : '#/shop';
    }
    case '/categories':
      return '#/categories';
    case '/product':
      return `#/product/${route.slug}`;
    case '/cart':
      return '#/cart';
    case '/checkout':
      return '#/checkout';
    case '/about':
      return '#/about';
    case '/contact':
      return '#/contact';
    case '/order-success':
      return `#/order-success/${route.orderId}`;
    default:
      return '#/';
  }
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return parseHash(window.location.hash);
    }
    return { path: '/' };
  });

  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHash(window.location.hash);
      setCurrentRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    const hash = routeToHash(route);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => navigate({ path: '/' });
  const goToShop = (category?: string, search?: string) =>
    navigate({ path: '/shop', category, search });
  const goToProduct = (slug: string) => navigate({ path: '/product', slug });
  const goToCart = () => navigate({ path: '/cart' });
  const goToCheckout = () => navigate({ path: '/checkout' });
  const goToAbout = () => navigate({ path: '/about' });
  const goToContact = () => navigate({ path: '/contact' });
  const goToCategories = () => navigate({ path: '/categories' });
  const goToOrderSuccess = (orderId: string) =>
    navigate({ path: '/order-success', orderId });

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        navigate,
        goToHome,
        goToShop,
        goToProduct,
        goToCart,
        goToCheckout,
        goToAbout,
        goToContact,
        goToCategories,
        goToOrderSuccess
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
