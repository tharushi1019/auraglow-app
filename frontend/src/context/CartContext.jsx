import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, syncCart } from '@/services/cartService';
import { fetchWishlist, toggleWishlistBackend } from '@/services/wishlistService';
import { products as mockProducts } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import AuthRequiredModal from '@/components/common/AuthRequiredModal';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authActionName, setAuthActionName] = useState('add items to your shopping bag');

  // Load data when user logs in, reset when logged out
  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      localStorage.removeItem('auraglow_cart');
      localStorage.removeItem('auraglow_wishlist');
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      const [rawCart, rawWishlist] = await Promise.all([
        fetchCart(),
        fetchWishlist(),
      ]);

      const enrichedCart = (rawCart || []).map(item => {
        const prod = mockProducts.find(p => p.id === (item.productId || item.id));
        return {
          ...item,
          id: item.productId || item.id,
          product: prod || { name: 'AuraGlow Product', price: item.price || 5000, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80' },
        };
      });

      const enrichedWishlist = (rawWishlist || []).map(id => {
        return mockProducts.find(p => p.id === id);
      }).filter(Boolean);

      setCart(enrichedCart);
      setWishlist(enrichedWishlist);
      setLoading(false);
    }
    loadData();
  }, [user]);

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
    if (!user) {
      setAuthActionName('add products to your shopping bag');
      setAuthModalOpen(true);
      return false;
    }

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
    return true;
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
    if (!user) {
      setAuthActionName('save products to your wishlist');
      setAuthModalOpen(true);
      return false;
    }

    const isMatched = wishlist.some(p => p.id === product.id);
    let newWishlist = [];

    if (isMatched) {
      newWishlist = wishlist.filter(p => p.id !== product.id);
    } else {
      newWishlist = [...wishlist, product];
    }
    setWishlist(newWishlist);

    const syncedIds = await toggleWishlistBackend(product.id);
    localStorage.setItem('auraglow_wishlist', JSON.stringify(syncedIds));
    return true;
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
        requireAuth: (actionMsg) => {
          if (!user) {
            setAuthActionName(actionMsg || 'perform this action');
            setAuthModalOpen(true);
            return true;
          }
          return false;
        }
      }}
    >
      {children}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionName={authActionName}
      />
    </CartContext.Provider>
  );
}

