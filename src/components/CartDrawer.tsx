import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { CartItemRow } from './CartItemRow';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  Utensils,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COUPONS } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    totalItemsCount,
    subtotal,
    discount,
    deliveryFee,
    packagingFee,
    gst,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    includeCutlery,
    setIncludeCutlery,
    clearCart
  } = useCart();

  const { goToCheckout, goToShop, goToCart } = useNavigation();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    goToCheckout();
  };

  const handleFullCartClick = () => {
    setIsCartDrawerOpen(false);
    goToCart();
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span>My Order</span>
                    <span className="text-xs font-normal text-gray-400">({totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'})</span>
                  </h2>

                  <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs text-gray-400 hover:text-red-600 font-medium px-2 py-1 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Close cart"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Free Delivery Meter */}
                {cart.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Truck className="w-3.5 h-3.5 text-orange-600" />
                        {amountNeededForFreeDelivery === 0 ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Free Delivery Unlocked!
                          </span>
                        ) : (
                          <span>
                            Add <span className="font-bold text-orange-600">₹{amountNeededForFreeDelivery}</span> more for FREE Delivery
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">₹499 Goal</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-600 transition-all duration-300 rounded-full"
                        style={{ width: `${deliveryProgressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Content */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-gray-900 mb-1">
                    Your Cart is Empty
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mb-5 leading-relaxed">
                    Explore our royal biryanis, slow-simmered curries, and tandoori specials.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      goToShop();
                    }}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Browse Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Cart Items List */}
                  <div className="space-y-1">
                    {cart.map((item) => (
                      <CartItemRow key={item.id} item={item} compact={true} />
                    ))}
                  </div>

                  {/* Cutlery preference */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Utensils className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">Include Cutlery & Napkins</p>
                        <p className="text-[10px] text-gray-500">Eco-friendly wooden spoons & tissues</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeCutlery}
                        onChange={(e) => setIncludeCutlery(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Promo Code Box */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-emerald-600" />
                          <div>
                            <span className="font-bold text-xs text-emerald-900 tracking-wider">
                              {appliedCoupon.code}
                            </span>
                            <p className="text-[10px] text-emerald-700">
                              {appliedCoupon.description} (Saved ₹{discount})
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                                setCouponError('');
                              }}
                              placeholder="Coupon code (e.g. GAON15)"
                              className="w-full pl-7 pr-3 py-1.5 text-xs uppercase bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Apply
                          </button>
                        </form>

                        {couponError && (
                          <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                        )}

                        {/* Quick coupon chips */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {COUPONS.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                const res = applyCoupon(c.code);
                                if (!res.success) setCouponError(res.message);
                              }}
                              className="text-[10px] bg-orange-50 hover:bg-orange-100 text-orange-800 font-medium px-2 py-0.5 rounded border border-orange-200 transition-colors"
                            >
                              Use <strong>{c.code}</strong>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Drawer Footer / Checkout summary */}
              {cart.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
                  {/* Cost breakdown */}
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">₹{subtotal}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount</span>
                        <span>- ₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Packaging</span>
                      <span className="font-medium text-gray-900">₹{packagingFee}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span className="font-medium text-gray-900">₹{gst}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-gray-900">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-orange-600 font-bold">₹{total}</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <button
                    type="button"
                    id="drawer-checkout-btn"
                    onClick={handleCheckoutClick}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-black transition-colors shadow-lg shadow-gray-200"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    type="button"
                    onClick={handleFullCartClick}
                    className="w-full text-center text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors pt-1"
                  >
                    View Full Cart Page
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
