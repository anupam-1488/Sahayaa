// src/components/Layout/Header.js
import React, { useState } from 'react';
import { Heart, User, Lock, LogOut, Menu, X } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../utils/constants';

const Header = ({ 
  activeSection, 
  setActiveSection, 
  user, 
  setShowLogin, 
  handleLogout 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigationClick = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              {/* <Heart className="w-7 h-7 text-white" /> */}
<img
  src="/logo.jpg"
  alt="Sahayaa Trust Logo"
  className="w-12 h-12 rounded-full object-cover"
/>

            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Sahayaa</h1>
              <p className="text-xs text-green-600 hidden sm:block">The one who stands with you</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigationClick(item.id)}
                className={`font-medium transition-colors capitalize ${
                  activeSection === item.id 
                    ? 'text-green-600 border-b-2 border-green-600 pb-1' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Authentication and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Admin</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-3">
              {/* Mobile Navigation */}
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigationClick(item.id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${
                    activeSection === item.id 
                      ? 'text-green-600 bg-green-50 font-medium' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-3 border-t border-gray-100">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Logged in as Admin</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full justify-center"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Admin Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;