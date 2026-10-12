import React, { createContext, useContext, useState, useEffect } from 'react';
import { addCartItem, clearCart as clearRemoteCart, fetchCart, removeCartItem } from '@/services/cartService';
import { fetchWishlist, toggleWishlistBackend } from '@/services/wishlistService';
import { useAuth } from '@/context/AuthContext';
import AuthRequiredModal from '@/components/common/AuthRequiredModal';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

function normalizeCart(items) {
  return items.map(item => {
    if (!item.product) throw new Error('The server returned a cart item without product details.');
    return {
      ...item,
      id: item.productId || item.id,
      price: Number(item.product.price ?? item.price),
      quantity: Number(item.quantity),
    };
  });
}

function getErrorMessage(error) {
  return error.message || 'The request could not be completed.';
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataUserId, setDataUserId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authActionName, setAuthActionName] = useState('add items to your shopping bag');

  // Load data when user logs in, reset when logged out
  useEffect(() => {
    let active = true;
    if (authLoading) {
      return () => { active = false; };
    }
    if (!user) {
      setCart([]);
      setWishlist([]);
      setDataUserId(null);
      localStorage.removeItem('auraglow_cart');
      localStorage.removeItem('auraglow_wishlist');
      setError('');
      setLoading(false);
      return () => { active = false; };
    }

    async function loadData() {
      setLoading(true);
      setError('');
      setCart([]);
      setWishlist([]);
      try {
        const [rawCart, rawWishlist] = await Promise.all([fetchCart(), fetchWishlist()]);
        if (!active) return;
        setCart(normalizeCart(rawCart));
        setWishlist(rawWishlist);
        setDataUserId(user.id);
      } catch (loadError) {
        if (!active) return;
        setCart([]);
        setWishlist([]);
        setDataUserId(user.id);
        setError(getErrorMessage(loadError));
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();

    return () => { active = false; };
  }, [user, authLoading]);

  const addToCart = async (product, qty = 1, selectedShade = null) => {
    if (!user) {
      setAuthActionName('add products to your shopping bag');
      setAuthModalOpen(true);
      return false;
    }

    const quantity = Number(qty);
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      setError('Quantity must be a positive whole number.');
      return false;
    }

    const existing = cart.find(item => item.id === product.id && (item.selectedShade || null) === selectedShade);
    try {
      const items = await addCartItem({
        productId: product.id,
        quantity: (existing?.quantity || 0) + quantity,
        selectedShade,
      });
      setCart(normalizeCart(items));
      setError('');
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    }
  };

  const visibleCart = dataUserId === user?.id ? cart : [];
  const visibleWishlist = dataUserId === user?.id ? wishlist : [];

  const removeFromCart = async (productId, selectedShade = null) => {
    try {
      setCart(normalizeCart(await removeCartItem(productId, selectedShade)));
      setError('');
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    }
  };

  const updateQuantity = async (productId, qty, selectedShade = null) => {
    const quantity = Number(qty);
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      setError('Quantity must be a positive whole number.');
      return false;
    }
    try {
      setCart(normalizeCart(await addCartItem({ productId, quantity, selectedShade })));
      setError('');
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await clearRemoteCart();
      setCart([]);
      setError('');
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      setAuthActionName('save products to your wishlist');
      setAuthModalOpen(true);
      return false;
    }

    try {
      setWishlist(await toggleWishlistBackend(product.id));
      setError('');
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart: visibleCart,
        wishlist: visibleWishlist,
        loading,
        error,
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
