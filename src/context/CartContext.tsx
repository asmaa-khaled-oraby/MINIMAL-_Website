
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (itemId: string, size: string, color: string) => void;
  updateQuantity: (itemId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate totals
    const items = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    setTotalItems(items);
    setTotalPrice(price);
  }, [cart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setCart(prevCart => {
      // Check if item is already in cart with same size and color
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.size === size && item.color === color
      );
      
      let newCart;
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
        
        toast.success(`Updated quantity in cart`);
      } else {
        // Add new item to cart
        newCart = [...prevCart, { product, quantity, size, color }];
        toast.success(`Added to cart`);
      }
      
      return newCart;
    });
  };

  const removeFromCart = (itemId: string, size: string, color: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(
        item => !(item.product.id === itemId && item.size === size && item.color === color)
      );
      
      toast.info(`Item removed from cart`);
      return newCart;
    });
  };

  const updateQuantity = (itemId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === itemId && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.info(`Cart cleared`);
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const checkout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      closeCart();
      navigate('/auth');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      setIsCheckingOut(true);
      
      // Calculate total price
      const totalAmount = cart.reduce(
        (total, item) => total + item.product.price * item.quantity, 
        0
      );
      
      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: totalAmount,
          status: 'pending',
        })
        .select()
        .single();
        
      if (orderError) {
        throw new Error(`Error creating order: ${orderError.message}`);
      }
      
      if (!order) {
        throw new Error('Failed to create order');
      }
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) {
        throw new Error(`Error creating order items: ${itemsError.message}`);
      }
      
      // Clear cart after successful checkout
      clearCart();
      closeCart();
      
      toast.success('Order placed successfully!');
      navigate('/orders');
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'An error occurred during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      closeCart,
      checkout,
      isCheckingOut
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
