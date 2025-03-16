
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-24 w-24 mx-auto text-primary mb-6" />
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
