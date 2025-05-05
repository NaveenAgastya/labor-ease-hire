
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { currentUser, userType, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-1 rounded-md mr-2">
              <span className="text-white font-bold text-xl">LE</span>
            </div>
            <span className="font-bold text-xl text-gray-800 hidden sm:inline-block">LaborEase</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary story-link font-medium">Home</Link>
            <Link to="/services" className="text-gray-600 hover:text-primary story-link font-medium">Services</Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-primary story-link font-medium">How It Works</Link>
            
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage src="/placeholder.svg" alt={currentUser.email} />
                      <AvatarFallback>{currentUser.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={userType === 'laborer' ? '/laborer-dashboard' : '/client-dashboard'}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in">
            <ul className="flex flex-col space-y-4">
              <li><Link to="/" className="block py-2 text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
              <li><Link to="/services" className="block py-2 text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Services</Link></li>
              <li><Link to="/how-it-works" className="block py-2 text-gray-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>How It Works</Link></li>
              
              {!currentUser ? (
                <div className="pt-4 flex flex-col space-y-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              ) : (
                <div className="pt-4 flex flex-col space-y-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link to={userType === 'laborer' ? '/laborer-dashboard' : '/client-dashboard'} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Log Out
                  </Button>
                </div>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
