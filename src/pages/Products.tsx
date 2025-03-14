
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sliders, X, ChevronDown } from 'lucide-react';
import { products } from '@/data/products';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Get unique categories from products
const categories = Array.from(new Set(products.map(p => p.category)));
const colors = Array.from(new Set(products.flatMap(p => p.colors || [])));
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const priceRanges = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity },
];

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRanges: [] as { min: number; max: number }[],
  });
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    // Apply filters
    let result = [...products];
    
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    
    if (filters.colors.length > 0) {
      result = result.filter(p => 
        p.colors?.some(color => filters.colors.includes(color))
      );
    }
    
    if (filters.sizes.length > 0) {
      // For this demo, we're assuming all products have all sizes
      // In a real app, you'd filter based on available sizes
    }
    
    if (filters.priceRanges.length > 0) {
      result = result.filter(p => 
        filters.priceRanges.some(range => 
          p.price >= range.min && p.price <= range.max
        )
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming there's a date field, if not this would need real data
        break;
      default: // 'featured'
        // Using the default order
        break;
    }
    
    setFilteredProducts(result);
  }, [filters, sortBy]);

  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const toggleColor = (color: string) => {
    setFilters(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const toggleSize = (size: string) => {
    setFilters(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const togglePriceRange = (range: { min: number; max: number }) => {
    setFilters(prev => {
      const exists = prev.priceRanges.some(
        r => r.min === range.min && r.max === range.max
      );
      
      const priceRanges = exists
        ? prev.priceRanges.filter(r => !(r.min === range.min && r.max === range.max))
        : [...prev.priceRanges, range];
      
      return { ...prev, priceRanges };
    });
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      colors: [],
      sizes: [],
      priceRanges: [],
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.categories.length > 0 ||
      filters.colors.length > 0 ||
      filters.sizes.length > 0 ||
      filters.priceRanges.length > 0
    );
  };

  const Filters = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-4 flex items-center">
          Categories
          <ChevronDown className="ml-2 h-4 w-4" />
        </h3>
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <label 
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Colors */}
      <div>
        <h3 className="font-medium mb-4 flex items-center">
          Colors
          <ChevronDown className="ml-2 h-4 w-4" />
        </h3>
        <div className="space-y-3">
          {colors.map(color => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox 
                id={`color-${color}`} 
                checked={filters.colors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <label 
                htmlFor={`color-${color}`}
                className="text-sm cursor-pointer"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Sizes */}
      <div>
        <h3 className="font-medium mb-4 flex items-center">
          Sizes
          <ChevronDown className="ml-2 h-4 w-4" />
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <Button
              key={size}
              variant={filters.sizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Price */}
      <div>
        <h3 className="font-medium mb-4 flex items-center">
          Price
          <ChevronDown className="ml-2 h-4 w-4" />
        </h3>
        <div className="space-y-3">
          {priceRanges.map(range => (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox 
                id={`price-${range.label}`} 
                checked={filters.priceRanges.some(
                  r => r.min === range.min && r.max === range.max
                )}
                onCheckedChange={() => togglePriceRange(range)}
              />
              <label 
                htmlFor={`price-${range.label}`}
                className="text-sm cursor-pointer"
              >
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {hasActiveFilters() && (
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="w-full"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Header />
      
      <div className="container pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 shrink-0">
            <Filters />
          </div>
          
          {/* Mobile Filters Button */}
          <div className="md:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Sliders className="mr-2 h-4 w-4" />
                  Filters {hasActiveFilters() && `(${Object.values(filters).flat().length})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <Filters />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}
              </p>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h2 className="text-xl font-medium mb-2">No products found</h2>
                <p className="text-muted-foreground mb-6">
                  Try changing your filters to find products
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Products;
