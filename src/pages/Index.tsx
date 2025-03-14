
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedProducts from '@/components/ui/FeaturedProducts';
import ProductCard from '@/components/ui/ProductCard';
import { ChevronRight } from 'lucide-react';
import { getFeaturedProducts, getBestSellers, getNewArrivals } from '@/data/products';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const featuredProducts = getFeaturedProducts().slice(0, 3);
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 2);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Minimalist design,<br />maximum comfort.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our premium t-shirts are crafted with high-quality materials and timeless designs that elevate your everyday style.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/products" className="btn-primary">
                  Shop Collection
                </Link>
                <Link to="/about" className="btn-secondary">
                  Learn More
                </Link>
              </div>

              {!user && (
                <div className="bg-muted p-4 rounded-lg mt-8">
                  <p className="text-sm mb-2">Create an account to save your favorites and track orders</p>
                  <Link to="/auth" className="text-sm font-medium text-primary hover:underline">
                    Sign up now →
                  </Link>
                </div>
              )}
            </div>
            
            <div className="relative aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Minimal T-shirt" 
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-lg shadow-lg border hidden md:block">
                <p className="font-medium">Sustainably sourced</p>
                <p className="text-sm text-muted-foreground">100% Organic cotton</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <FeaturedProducts 
        title="Featured Collection"
        products={featuredProducts}
        viewAllLink="/products"
        columns={3}
      />

      {/* Bestsellers */}
      <FeaturedProducts 
        title="Best Sellers"
        description="Our most popular products based on sales"
        products={bestSellers}
        viewAllLink="/products"
        columns={4}
      />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 md:py-24 bg-accent/40">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium tracking-tight mb-4">New Arrivals</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The latest additions to our collection, designed with the same attention to detail and quality you expect.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {newArrivals.map(product => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <ProductCard key={product.id} product={product} />
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/products">Shop All Products</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
              Join our community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sign up to receive updates on new product releases, exclusive offers, and styling inspiration.
            </p>
            {user ? (
              <p className="font-medium">Thanks for being a member!</p>
            ) : (
              <Button asChild size="lg">
                <Link to="/auth">Create Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
