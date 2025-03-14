
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Product, getProductById } from '@/data/products';
import { Heart, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';

const Wishlist = () => {
  const { user, loading } = useAuth();
  const { wishlistItems, isLoading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (wishlistItems.length > 0) {
      const wishlistProducts = wishlistItems
        .map(item => getProductById(item.product_id))
        .filter((product): product is Product => product !== undefined);
      
      setProducts(wishlistProducts);
    } else {
      setProducts([]);
    }
  }, [wishlistItems]);

  if (loading || wishlistLoading) {
    return (
      <>
        <Header />
        <div className="container py-32 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading your wishlist...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-32">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-muted rounded-full mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add products to your wishlist to keep track of items you love
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showWishlistButton
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
