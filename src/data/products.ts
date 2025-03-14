
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  colors: string[];
  sizes: string[];
  images: string[];
  category: string;
  featured?: boolean;
  bestSeller?: boolean;
  new?: boolean;
}

export const products: Product[] = [
  {
    id: "tshirt-001",
    name: "Essential Cotton Tee",
    description: "Our classic crew neck t-shirt made from premium organic cotton. Designed for everyday comfort with a timeless fit and exceptional softness. A wardrobe staple that pairs with anything.",
    price: 39.99,
    colors: ["Black", "White", "Navy", "Heather Gray"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Basic",
    featured: true,
    bestSeller: true
  },
  {
    id: "tshirt-002",
    name: "Premium Minimalist Tee",
    description: "Effortless style with our premium minimalist t-shirt. Crafted from luxurious long-staple cotton with a clean design and immaculate finishing. Superior comfort for the discerning customer.",
    price: 49.99,
    colors: ["Black", "White", "Sage", "Sand"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Premium",
    featured: true
  },
  {
    id: "tshirt-003",
    name: "Oversized Contemporary Tee",
    description: "A modern silhouette with our oversized contemporary t-shirt. Features a dropped shoulder and relaxed fit. Made from heavyweight cotton for substantial feel and excellent drape.",
    price: 45.99,
    colors: ["Black", "White", "Washed Blue", "Terracotta"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Contemporary",
    new: true
  },
  {
    id: "tshirt-004",
    name: "Heavyweight Textured Tee",
    description: "Substantial and distinctive with our heavyweight textured t-shirt. A unique slub texture gives depth and character to this elevated basic. Perfect for creating effortless, sophisticated looks.",
    price: 55.99,
    colors: ["Charcoal", "Cream", "Rust", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551798507-629020c81463?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Premium",
    bestSeller: true
  },
  {
    id: "tshirt-005",
    name: "Organic Cotton Pocket Tee",
    description: "Simple detail makes all the difference with our organic cotton pocket t-shirt. Features a single chest pocket on our signature premium cotton base. A refined casual essential.",
    price: 42.99,
    colors: ["White", "Navy", "Olive", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Basic",
    featured: true
  },
  {
    id: "tshirt-006",
    name: "Relaxed Merino Blend Tee",
    description: "Luxurious comfort with our relaxed merino blend t-shirt. Breathable, temperature-regulating, and incredibly soft. The perfect balance of casual style and premium materials.",
    price: 65.99,
    colors: ["Black", "Gray Melange", "Burgundy", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Premium",
    new: true
  },
  {
    id: "tshirt-007",
    name: "Vintage Wash Cotton Tee",
    description: "Lived-in comfort from day one with our vintage wash cotton t-shirt. Special garment dyeing process creates unique color variation. Pre-shrunk for a consistent fit.",
    price: 47.99,
    colors: ["Washed Black", "Washed Blue", "Washed Burgundy", "Washed Green"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516720262454-a5a1c0d48a58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Vintage",
    bestSeller: true
  },
  {
    id: "tshirt-008",
    name: "Long Sleeve Essential Tee",
    description: "Extended comfort with our long sleeve essential t-shirt. The same premium quality as our classic tee, with added versatility for year-round wear. Clean design with immaculate finishing.",
    price: 49.99,
    colors: ["Black", "White", "Gray", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609873814058-a8928924184a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Basic",
    featured: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getBestSellers = (): Product[] => {
  return products.filter(product => product.bestSeller);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(product => product.new);
};
