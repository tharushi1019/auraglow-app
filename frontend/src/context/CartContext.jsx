/**
 * =============================================================================
 *  AuraGlow — Cart Context Provider (frontend/src/context/CartContext.jsx)
 *  Module 3: Shopping Cart & Wishlist (Achani)
 * =============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, syncCart } from '@/services/cartService';
import { fetchWishlist, toggleWishlistBackend } from '@/services/wishlistService';
import { products as mockProducts } from '@/data/mockData';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    async function loadData() {
      const [rawCart, rawWishlist] = await Promise.all([
        fetchCart(),
        fetchWishlist(),
      ]);

      // Enrich raw cart items with full product objects from mockData/API
      const enrichedCart = rawCart.map(item => {
        const prod = mockProducts.find(p => p.id === (item.productId || item.id));
        return {
          ...item,
          id: item.productId || item.id,
          product: prod || { name: 'AuraGlow Product', price: item.price || 5000, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80' },
        };
      });

      // Enrich wishlist product IDs with full objects
      const enrichedWishlist = rawWishlist.map(id => {
        return mockProducts.find(p => p.id === id);
      }).filter(Boolean);

      setCart(enrichedCart);
      setWishlist(enrichedWishlist);
      setLoading(false);
    }
    loadData();
  }, []);

  // Sync Cart to local/remote when modified
  const updateCartState = async (newCart) => {
    setCart(newCart);
    await syncCart(
      newCart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
    );
  };

  const addToCart = async (product, qty = 1) => {
    const quantity = Number(qty);
    const existingIndex = cart.findIndex(item => item.id === product.id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        id: product.id,
        quantity,
        price: product.price,
        product,
      });
    }
    await updateCartState(newCart);
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    await updateCartState(newCart);
  };

  const updateQuantity = async (productId, qty) => {
    const quantity = Math.max(1, Number(qty));
    const newCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    await updateCartState(newCart);
  };

  const clearCart = async () => {
    await updateCartState([]);
  };

  const toggleWishlist = async (product) => {
    const isMatched = wishlist.some(p => p.id === product.id);
    let newWishlist = [];

    if (isMatched) {
      newWishlist = wishlist.filter(p => p.id !== product.id);
    } else {
      newWishlist = [...wishlist, product];
    }
    setWishlist(newWishlist);

    // Sync with backend / local
    const syncedIds = await toggleWishlistBackend(product.id);
    localStorage.setItem('auraglow_wishlist', JSON.stringify(syncedIds));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
