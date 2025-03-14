
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Heart } from 'lucide-react';
import { getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewsList from '@/components/reviews/ReviewsList';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [mainImage, setMainImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);

  // Get product data
  const product = id ? getProductById(id) : null;

  // Check if product is in wishlist
  const productInWishlist = id ? isInWishlist(id) : false;

  // Redirect to 404 if product not found
  useEffect(() => {
    if (!product) {
      navigate('/not-found', { replace: true });
    } else {
      // Set default values
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return null;
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }

    if (!selectedColor && product.colors && product.colors.length > 0) {
      toast.error('Please select a color');
      return;
    }

    setIsAddingToCart(true);
    
    setTimeout(() => {
      addToCart(product, quantity, selectedSize, selectedColor);
      setIsAddingToCart(false);
    }, 500); // Simulate a slight delay for better UX
  };

  const handleWishlistClick = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      navigate('/auth');
      return;
    }

    if (productInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleReviewAdded = () => {
    setReviewsRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Header />
      
      <div className="container pt-32 pb-16">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
              <img 
                src={product.images[mainImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    className={`aspect-square bg-secondary rounded-md overflow-hidden border-2 ${
                      mainImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setMainImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistClick}
                className="flex-shrink-0"
                aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart 
                  className={`h-5 w-5 ${productInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-2xl font-semibold">
                ${product.price.toFixed(2)}
              </span>
              
              {/* Display sale price only if we have the properties */}
              {product.hasOwnProperty('originalPrice') && (
                <span className="text-muted-foreground line-through">
                  ${(product as any).originalPrice.toFixed(2)}
                </span>
              )}
              
              {product.hasOwnProperty('onSale') && (product as any).onSale && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Sale
                </span>
              )}
            </div>
            
            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>
            
            <Separator className="my-6" />
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color: <span className="capitalize">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`relative w-11 h-11 rounded-full border bg-${color}-500 ${
                        selectedColor === color ? 
                          'ring-2 ring-offset-2 ring-primary' : 
                          'ring-1 ring-muted hover:ring-2 hover:ring-primary/50'
                      }`}
                      onClick={() => setSelectedColor(color)}
                      style={{backgroundColor: color}}
                      aria-label={`Select ${color} color`}
                    >
                      {selectedColor === color && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white drop-shadow-md" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Size: {selectedSize.toUpperCase()}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`min-w-[3rem] h-10 px-3 flex items-center justify-center rounded-md border ${
                        selectedSize === size ?
                          'bg-primary text-primary-foreground' :
                          'bg-background hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center w-32">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 text-center">
                  <span className="text-lg font-medium">{quantity}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncreaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full py-6 mt-4" 
              size="lg"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </>
              )}
            </Button>
            
            {/* Additional Info */}
            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              <p>✓ Free shipping on orders over $50</p>
              <p>✓ Easy 30 day returns</p>
              <p>✓ Secure checkout</p>
            </div>
          </div>
        </div>
        
        {/* Product Reviews Section */}
        <div className="mt-16">
          <Tabs defaultValue="reviews">
            <TabsList className="mb-6">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                  <ReviewsList 
                    productId={product.id} 
                    refreshTrigger={reviewsRefreshTrigger} 
                  />
                </div>
                
                <div className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
                  <h2 className="text-xl font-bold mb-4">Write a Review</h2>
                  <ReviewForm 
                    productId={product.id}
                    onReviewAdded={handleReviewAdded}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">Product Details</h2>
                <p className="mb-4">
                  {product.description}
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Premium quality materials</li>
                  <li>Durable construction</li>
                  <li>Comfort-focused design</li>
                  <li>Versatile for everyday wear</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Materials & Care</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>100% premium cotton</li>
                  <li>Machine wash cold</li>
                  <li>Tumble dry low</li>
                  <li>Do not bleach</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                <p className="mb-4">
                  We offer various shipping options to get your products to you as quickly as possible.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Shipping Options</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Standard Shipping (3-5 business days):</strong> $5.99, 
                    Free on orders over $50
                  </li>
                  <li>
                    <strong>Express Shipping (2-3 business days):</strong> $12.99
                  </li>
                  <li>
                    <strong>Next Day Delivery (order before 2pm):</strong> $19.99
                  </li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Returns Policy</h3>
                <p className="mb-2">
                  We offer a 30-day return policy for most items. To be eligible for a return:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Items must be unused and in the same condition that you received them</li>
                  <li>Items must be in the original packaging</li>
                  <li>You'll need the receipt or proof of purchase</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ProductDetail;
