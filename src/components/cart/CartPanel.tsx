
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CartItemComponent from '@/components/ui/CartItem';
import { useAuth } from '@/context/AuthContext';

const CartPanel = () => {
  const { cart, isCartOpen, closeCart, totalItems, totalPrice, checkout, isCheckingOut } = useCart();
  const { user } = useAuth();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={closeCart}
        aria-hidden="true"
      />
      
      {/* Cart Panel */}
      <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({totalItems})
            </h2>
            <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Cart content */}
          <div className="flex-1 overflow-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Looks like you haven't added anything to your cart yet
                </p>
                <Button size="sm" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <CartItemComponent 
                    key={`${item.product.id}-${item.size}-${item.color}-${index}`} 
                    item={item} 
                    compact={true}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Footer with total and checkout */}
          {cart.length > 0 && (
            <div className="border-t p-4 bg-muted/30">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={checkout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                  onClick={closeCart}
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
                
                {!user && (
                  <div className="text-sm text-muted-foreground mt-2 bg-accent/50 p-2 rounded">
                    <Link to="/auth" className="font-medium text-primary hover:underline" onClick={closeCart}>
                      Sign in
                    </Link> to save your cart and checkout faster
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPanel;
