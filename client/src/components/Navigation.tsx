import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: "fas fa-home" },
    { href: "/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { href: "/projects/new", label: "Projects", icon: "fas fa-project-diagram" },
    { href: "/analytics", label: "Analytics", icon: "fas fa-chart-line" },
    { href: "/pricing", label: "Pricing", icon: "fas fa-tags" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-layer-group text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">AuthStorage</span>
            </div>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-medium transition-colors ${
                      location === item.href
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    <i className={`${item.icon} mr-2`}></i>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-blue-600 text-sm"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName || "User"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
