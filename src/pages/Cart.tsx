
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartItemComponent from '@/components/ui/CartItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
  const { cart, totalItems, totalPrice, clearCart, checkout, isCheckingOut } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = async () => {
    await checkout();
  };

  return (
    <>
      <Header />
      
      <div className="container pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Your Cart
            </h1>
            <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet
              </p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-card border rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="font-medium">
                      {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearCart}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Clear Cart
                    </Button>
                  </div>
                  
                  <div className="divide-y">
                    {cart.map((item, index) => (
                      <CartItemComponent key={`${item.product.id}-${item.size}-${item.color}-${index}`} item={item} />
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted p-6">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between mb-2 text-muted-foreground">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between mb-6 text-lg font-medium">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {!user && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4 text-sm">
                      <p>Please <Button variant="link" onClick={() => navigate('/auth')} className="p-0 h-auto">login</Button> or <Button variant="link" onClick={() => navigate('/auth?tab=register')} className="p-0 h-auto">create an account</Button> to complete your purchase.</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full py-6" 
                    size="lg"
                    disabled={isCheckingOut || !user}
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Cart;
