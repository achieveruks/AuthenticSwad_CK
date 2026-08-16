import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { CartItemRow } from '../components/CartItemRow';
import { COUPONS } from '../data/products';
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  Check,
  Tag,
  Utensils,
  MessageSquare,
  ShieldCheck,
  Trash2
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
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
    specialInstructions,
    setSpecialInstructions,
    clearCart
  } = useCart();

  const { goToShop, goToCheckout } = useNavigation();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h2 className="font-extrabold text-xl sm:text-2xl text-gray-900">
            Your Cart is Currently Empty
          </h2>
          <p className="text-xs text-gray-500">
            Looks like you haven&apos;t added any delicacies yet. Explore our slow-cooked handis and freshly baked breads!
          </p>
        </div>
        <button
          type="button"
          onClick={() => goToShop()}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
        >
          <span>Explore Authentic Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Title & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h1 className="font-extrabold text-xl sm:text-2xl text-gray-950">
            Your Order Cart
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {totalItemsCount} {totalItemsCount === 1 ? 'delicacy' : 'delicacies'} ready to be prepared fresh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToShop()}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Add More Items</span>
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-orange-50/60 border border-orange-200/80 rounded-xl p-3.5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1.5 font-bold text-gray-800">
            <Truck className="w-3.5 h-3.5 text-orange-600" />
            {amountNeededForFreeDelivery === 0 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> Free Express Doorstep Delivery Unlocked!
              </span>
            ) : (
              <span>
                Add <strong className="text-orange-700 font-extrabold">₹{amountNeededForFreeDelivery}</strong> more to get Free Delivery!
              </span>
            )}
          </span>
          <span className="text-[10px] text-gray-500 font-semibold">₹499 Minimum for Free Delivery</span>
        </div>
        <div className="w-full h-1.5 bg-orange-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-600 transition-all duration-500 rounded-full"
            style={{ width: `${deliveryProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Layout: Left Items + Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cart Items List & Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Items Container */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs divide-y divide-gray-100">
            {cart.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Cooking Instructions & Cutlery Preferences */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
              <span>Special Cooking Instructions & Preferences</span>
            </h3>

            {/* Cutlery Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5 text-gray-700" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Include Cutlery & Napkins</p>
                  <p className="text-[10px] text-gray-500">Eco-friendly wooden cutlery & napkins</p>
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

            {/* Note Textarea */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Notes for the Master Chef (e.g. Less oil, make spicy, avoid coriander)
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Write any specific dietary or preparation requests here..."
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Bill Summary & Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          {/* Promo code card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-2.5">
            <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-orange-600" />
              <span>Apply Discount Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-200/60 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    %
                  </div>
                  <div>
                    <span className="font-bold text-xs text-emerald-950 tracking-wider">
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
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-0.5"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter code (GAON15 / WELCOME50)"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-medium focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[10px] text-rose-600">{couponError}</p>
                )}

                {/* Available coupons list */}
                <div className="pt-1">
                  <p className="text-[10px] text-gray-400 font-medium mb-1">Available Offers:</p>
                  <div className="space-y-1">
                    {COUPONS.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          const res = applyCoupon(c.code);
                          if (!res.success) setCouponError(res.message);
                        }}
                        className="w-full text-left p-2 rounded-lg bg-orange-50/50 hover:bg-orange-100/70 border border-orange-200/70 transition-colors flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-orange-950">{c.code}</span>
                          <p className="text-[10px] text-gray-500">{c.description}</p>
                        </div>
                        <span className="text-[11px] font-bold text-orange-600">Apply</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Bill Breakdown Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3.5">
            <h3 className="font-bold text-sm text-gray-900 pb-2.5 border-b border-gray-100">
              Bill Summary
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Item Subtotal ({totalItemsCount} items)</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Eco Thermal Packaging</span>
                <span>₹{packagingFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Restaurant GST (5%)</span>
                <span>₹{gst}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline text-xs font-bold text-gray-900">
                <span>Grand Total</span>
                <span className="font-extrabold text-xl text-orange-600">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              id="cart-checkout-proceed-btn"
              onClick={goToCheckout}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Checkout & Demo Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
