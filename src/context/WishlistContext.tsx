
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Product } from '@/data/products';

type WishlistItem = {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user?.id || '');

      if (error) {
        throw error;
      }

      setWishlistItems(data || []);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) {
        throw error;
      }

      await fetchWishlistItems();
      toast.success('Item added to wishlist');
    } catch (error: any) {
      toast.error('Error adding to wishlist: ' + error.message);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .match({
          user_id: user.id,
          product_id: productId
        });

      if (error) {
        throw error;
      }

      await fetchWishlistItems();
      toast.info('Item removed from wishlist');
    } catch (error: any) {
      toast.error('Error removing from wishlist: ' + error.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        isLoading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
