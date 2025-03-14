import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import { Button } from './button';

interface CartItemProps {
  item: CartItem;
  compact?: boolean;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, compact = false }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const { product, quantity, size, color } = item;

  const handleRemove = () => {
    removeFromCart(product.id, size, color);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(product.id, size, color, quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, size, color, quantity + 1);
  };

  if (compact) {
    return (
      <div className="flex items-start gap-3 py-3 group">
        <Link 
          to={`/product/${product.id}`} 
          className="shrink-0 h-16 w-16 bg-secondary rounded overflow-hidden"
        >
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="h-full w-full object-cover"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link 
            to={`/product/${product.id}`}
            className="font-medium text-sm line-clamp-1 hover:underline"
          >
            {product.name}
          </Link>
          
          <div className="text-xs text-muted-foreground mt-1">
            <span className="capitalize">{color}</span>
            {size && <> · Size: {size.toUpperCase()}</>}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="text-sm w-6 text-center">{quantity}</span>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleIncreaseQuantity}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="text-sm font-medium">${(product.price * quantity).toFixed(2)}</div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-secondary rounded overflow-hidden shrink-0">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <h3 className="font-medium truncate">{product.name}</h3>
          <span className="font-medium">${product.price.toFixed(2)}</span>
        </div>
        
        <div className="text-sm text-muted-foreground mb-2">
          <p>Size: {size}</p>
          <p>Color: {color}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded">
            <button 
              className="p-1 hover:bg-muted transition-colors"
              onClick={handleDecreaseQuantity}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-2 py-1 w-8 text-center">{quantity}</span>
            <button 
              className="p-1 hover:bg-muted transition-colors"
              onClick={handleIncreaseQuantity}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button 
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;
