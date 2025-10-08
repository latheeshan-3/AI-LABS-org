import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 m-3 rounded-2xl bg-white/3 backdrop-blur-md">
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <div className="flex items-center space-x-2"></div>
      </Link>
            <Link to="/" className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 h-12">

    {/* Logo Image */}
    <div className="h-28 w-auto flex items-center">
      <img
        src="/logo4.png"
        alt="AI Labs Logo"
        className="max-h-28 w-auto object-contain"
      />
    </div>
        </div>


   
</Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/services" className="text-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
              
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 hover:bg-white/10"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <LogIn size={18} />
                  Login
                </Button>
                <Button 
                  className="glow-button flex items-center gap-2 px-6 py-2"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <UserPlus size={18} />
                  Register
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/services" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  to="/contact" 
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="glass-button justify-center"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogIn size={18} className="mr-2" />
                    Login
                  </Button>
                  <Button 
                    className="glow-button justify-center"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <UserPlus size={18} className="mr-2" />
                    Register
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;