import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, Shoe } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (shoe: Shoe, size: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

const registerSession = async (sessionId: string) => {
  await supabase
    .from('cart_sessions')
    .upsert({ session_id: sessionId }, { onConflict: 'session_id' })
    .select()
    .maybeSingle();
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const sessionId = getSessionId();

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        shoe:shoes(*)
      `)
      .eq('session_id', sessionId);

    if (!error && data) {
      setCartItems(data.map(item => ({
        ...item,
        shoe: Array.isArray(item.shoe) ? item.shoe[0] : item.shoe
      })));
    }
  };

  useEffect(() => {
    registerSession(sessionId);
    fetchCartItems();
  }, []);

  const addToCart = async (shoe: Shoe, size: string) => {
    const existingItem = cartItems.find(
      item => item.shoe_id === shoe.id && item.size === size
    );

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          shoe_id: shoe.id,
          size,
          quantity: 1
        });

      if (!error) {
        await fetchCartItems();
      }
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      await fetchCartItems();
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (!error) {
      await fetchCartItems();
    }
  };

  const clearCart = async () => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    if (!error) {
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.shoe?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
