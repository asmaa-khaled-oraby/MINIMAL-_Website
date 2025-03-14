
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/data/products';

interface FeaturedProductsProps {
  title: string;
  description?: string;
  products: Product[];
  viewAllLink?: string;
  columns?: 2 | 3 | 4;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  description,
  products,
  viewAllLink = '/products',
  columns = 3
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <div className={`flex justify-between items-${description ? 'start' : 'center'} mb-8`}>
          <div>
            <h2 className="text-3xl font-medium tracking-tight">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
            )}
          </div>
          
          {viewAllLink && (
            <Link to={viewAllLink} className="flex items-center gap-1 hover:underline shrink-0 mt-1">
              View All <ChevronRight size={16} />
            </Link>
          )}
        </div>
        
        <div className={`grid sm:grid-cols-2 md:grid-cols-${columns} gap-6`}>
          {products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
