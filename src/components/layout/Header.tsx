import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, ShoppingCart, User, Package, Heart } from 'lucide-react';

const Header = () => {
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Update header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Calculate cart items quantity for badge
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed w-full z-50 transition-all duration-200",
        isScrolled || mobileMenuOpen ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Shop</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 flex-1 justify-center">
              <Link
                to="/products"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === "/products" ? "text-primary" : "text-muted-foreground"
                )}
              >
                All Products
              </Link>
              <Link
                to="/products?category=Basic"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Basic
              </Link>
              <Link
                to="/products?category=Premium"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Premium
              </Link>
              <Link
                to="/products?category=Contemporary"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Contemporary
              </Link>
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                <Link
                  to="/orders"
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                  aria-label="Orders"
                >
                  <Package className="h-5 w-5" />
                </Link>
                <Link
                  to="/profile"
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className={buttonVariants({ variant: "outline", size: isMobile ? "sm" : "default" })}
              >
                Login
              </Link>
            )}
            
            <button
              onClick={() => navigate("/cart")}
              className={cn(
                buttonVariants({ variant: "outline", size: isMobile ? "icon" : "default" }),
                "relative"
              )}
              aria-label="Cart"
            >
              {isMobile ? (
                <ShoppingCart className="h-5 w-5" />
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                </>
              )}
              
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </button>
            
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className={buttonVariants({ variant: "ghost", size: "icon" })}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="border-t py-4 px-4 bg-white">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/products"
              className="text-sm font-medium py-2 px-4 hover:bg-muted rounded-md"
            >
              All Products
            </Link>
            <Link
              to="/products?category=Basic"
              className="text-sm font-medium py-2 px-4 hover:bg-muted rounded-md"
            >
              Basic
            </Link>
            <Link
              to="/products?category=Premium"
              className="text-sm font-medium py-2 px-4 hover:bg-muted rounded-md"
            >
              Premium
            </Link>
            <Link
              to="/products?category=Contemporary"
              className="text-sm font-medium py-2 px-4 hover:bg-muted rounded-md"
            >
              Contemporary
            </Link>
            
            {user && (
              <>
                <div className="border-t pt-2 mt-2" />
                <Link
                  to="/wishlist"
                  className="text-sm font-medium py-2 px-4 hover:bg-muted rounded-md flex items-center"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
                <Link
                  to="/orders"
                  className="text-sm font-medium py-2 px-4 hover:bg-muted rounded-md flex items-center"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium py-2 px-4 hover:bg-muted rounded-md flex items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium py-2 px-4 text-left w-full hover:bg-muted rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
