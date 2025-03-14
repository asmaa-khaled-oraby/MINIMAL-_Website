
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/products';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  showWishlistButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  index = 0,
  showWishlistButton = false
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  // Calculate delay for staggered animations
  const delay = `delay-${(index % 5) * 100}`;
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  
  return (
    <div 
      className={`group animate-fade-in ${delay} opacity-0`}
      style={{ animationFillMode: 'forwards' }}
    >
      <Link 
        to={`/product/${product.id}`}
        className="block relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showWishlistButton && (
          <button
            onClick={handleWishlistToggle}
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon" }),
              "absolute top-2 right-2 z-10 opacity-70 hover:opacity-100 transition-opacity"
            )}
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isInWishlist(product.id) ? "fill-primary text-primary" : "text-foreground"
              )} 
            />
          </button>
        )}
        
        <div className="relative overflow-hidden rounded-lg bg-secondary transition-all duration-500">
          <div className="product-img aspect-[4/5] relative">
            <img
              src={isHovered && product.images.length > 1 ? product.images[1] : product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
            
            {/* Product badges */}
            {(product.new || product.bestSeller) && (
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.new && (
                  <span className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-full">
                    New
                  </span>
                )}
                {product.bestSeller && (
                  <span className="text-xs px-3 py-1 bg-background text-foreground rounded-full">
                    Best Seller
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 space-y-1">
          <h3 className="font-medium group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
          
          {/* Color options preview */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {product.colors.slice(0, 4).map((color, i) => (
                <div 
                  key={i}
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ 
                    backgroundColor: 
                      color.toLowerCase() === 'black' ? '#000' :
                      color.toLowerCase() === 'white' ? '#fff' :
                      color.toLowerCase() === 'navy' ? '#0a192f' :
                      color.toLowerCase() === 'heather gray' ? '#9ca3af' :
                      color.toLowerCase() === 'charcoal' ? '#333' :
                      color.toLowerCase() === 'cream' ? '#fffdd0' :
                      color.toLowerCase() === 'rust' ? '#b7410e' :
                      color.toLowerCase() === 'olive' ? '#556b2f' :
                      color.toLowerCase() === 'sage' ? '#bcb88a' :
                      color.toLowerCase() === 'sand' ? '#c2b280' :
                      color.toLowerCase() === 'washed blue' ? '#7ca1b4' :
                      color.toLowerCase() === 'terracotta' ? '#e2725b' :
                      color.toLowerCase() === 'burgundy' ? '#800020' :
                      color.toLowerCase() === 'gray melange' ? '#b8b9ba' :
                      color.toLowerCase() === 'washed black' ? '#333' :
                      color.toLowerCase() === 'washed burgundy' ? '#9f1d35' :
                      color.toLowerCase() === 'washed green' ? '#77815c' :
                      '#ddd'
                  }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
