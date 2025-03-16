
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pen, LayoutGrid, Book, Coins, Menu, X, User } from "lucide-react";
import WalletConnect from "@/components/wallet/WalletConnect";
import { useWallet } from "@/context/WalletContext";
import { shortenAddress } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { address, isConnected } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/", icon: <LayoutGrid className="h-4 w-4 mr-2" /> },
    { name: "Articles", path: "/articles", icon: <Book className="h-4 w-4 mr-2" /> },
    { name: "Tokenomics", path: "/tokenomics", icon: <Coins className="h-4 w-4 mr-2" /> },
  ];

  const isActive = (path: string) => {
    // Special case for home route
    if (path === "/" && location.pathname === "/") return true;
    
    // Check if the current path starts with the nav link path
    // (but exclude home path from this check to avoid it always being active)
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/"
              className="flex items-center space-x-2 transition-opacity duration-200 hover:opacity-80"
            >
              <div className="bg-primary text-primary-foreground rounded-lg p-1.5">
                <Pen className="h-5 w-5" />
              </div>
              <span className="font-medium text-lg">Mini Blogs</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button 
                  variant={isActive(link.path) ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`rounded-full transition-all duration-300 ${
                    isActive(link.path) ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <WalletConnect />
            </div>
            
            <Link to="/create-article">
              <Button size="sm" className="rounded-full hidden md:flex">
                <Pen className="h-4 w-4 mr-2" />
                Write
              </Button>
            </Link>
            
            <Link to="/profile" className="flex items-center">
              <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                <AvatarFallback className="bg-primary/10 text-primary font-mono text-xs">
                  {isConnected && address ? shortenAddress(address, 2) : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel animate-scale-in origin-top rounded-b-2xl mx-4">
          <div className="py-3 px-4 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center py-3 px-4 rounded-lg ${
                  isActive(link.path) 
                    ? "bg-secondary text-secondary-foreground font-medium" 
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link 
              to="/profile"
              className="flex items-center py-3 px-4 rounded-lg text-muted-foreground hover:bg-secondary/50"
            >
              <User className="h-4 w-4 mr-2" />
              My Wallet
            </Link>
            <div className="mt-2 py-2">
              <WalletConnect />
            </div>
            <Link 
              to="/create-article"
              className="flex items-center py-3 px-4 mt-2 rounded-lg text-primary-foreground bg-primary"
            >
              <Pen className="h-4 w-4 mr-2" />
              Write Article
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
