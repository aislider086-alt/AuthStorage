import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
  Menu, 
  X, 
  LogOut 
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" data-testid="link-home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CreativeFlow</span>
            </Link>
            
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link 
                  href="/" 
                  data-testid="nav-link-home"
                  className={`font-medium transition-colors ${
                    isActive("/") 
                      ? "text-primary-600" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/dashboard" 
                  data-testid="nav-link-dashboard"
                  className={`font-medium transition-colors ${
                    isActive("/dashboard") 
                      ? "text-primary-600" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/projects/new" 
                  data-testid="nav-link-projects"
                  className={`font-medium transition-colors ${
                    isActive("/projects/new") 
                      ? "text-primary-600" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  New Project
                </Link>
                <Link 
                  href="/analytics" 
                  data-testid="nav-link-analytics"
                  className={`font-medium transition-colors ${
                    isActive("/analytics") 
                      ? "text-primary-600" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  Analytics
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    data-testid="nav-link-admin"
                    className={`font-medium transition-colors ${
                      isActive("/admin") 
                        ? "text-primary-600" 
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/pricing" 
                  data-testid="nav-link-pricing"
                  className={`font-medium transition-colors ${
                    isActive("/pricing") 
                      ? "text-primary-600" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  Pricing
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hi, {user?.firstName || user?.email?.split('@')[0] || 'User'}
                </span>
                <Button
                  data-testid="button-sign-out"
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  data-testid="button-sign-in"
                  variant="ghost"
                  onClick={handleSignIn}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Sign In
                </Button>
                <Button
                  data-testid="button-get-started"
                  onClick={handleSignIn}
                  className="bg-primary-600 text-white hover:bg-primary-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              data-testid="button-mobile-menu"
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    data-testid="mobile-nav-link-home"
                    className={`block px-3 py-2 rounded-md font-medium ${
                      isActive("/")
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    data-testid="mobile-nav-link-dashboard"
                    className={`block px-3 py-2 rounded-md font-medium ${
                      isActive("/dashboard")
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/projects/new"
                    data-testid="mobile-nav-link-projects"
                    className={`block px-3 py-2 rounded-md font-medium ${
                      isActive("/projects/new")
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    New Project
                  </Link>
                  <Link
                    href="/analytics"
                    data-testid="mobile-nav-link-analytics"
                    className={`block px-3 py-2 rounded-md font-medium ${
                      isActive("/analytics")
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      data-testid="mobile-nav-link-admin"
                      className={`block px-3 py-2 rounded-md font-medium ${
                        isActive("/admin")
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/pricing"
                    data-testid="mobile-nav-link-pricing"
                    className={`block px-3 py-2 rounded-md font-medium ${
                      isActive("/pricing")
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="px-3 py-2 text-sm text-gray-700">
                      Hi, {user?.firstName || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <Button
                      data-testid="mobile-button-sign-out"
                      variant="ghost"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full justify-start px-3 py-2 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Button
                    data-testid="mobile-button-sign-in"
                    variant="ghost"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignIn();
                    }}
                    className="w-full justify-start px-3 py-2"
                  >
                    Sign In
                  </Button>
                  <Button
                    data-testid="mobile-button-get-started"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignIn();
                    }}
                    className="w-full bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
