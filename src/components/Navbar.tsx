import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { AuthModal } from './AuthModal';
import {
  Car,
  Globe,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  CalendarCheck,
  Sparkles,
  LogIn,
  UserPlus,
  PenTool,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  currentUser,
  setCurrentUser,
  activeBookingsCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser({
      name: 'Guest User',
      email: 'guest@bharatwheels.in',
      phone: '',
      role: 'customer',
      city: 'Mumbai',
    });
  };

  const isGuest = currentUser.name === 'Guest User' || !currentUser.email;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top announcement mini-bar */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-[11px] py-1 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                College Project Demo
              </span>
              <span className="truncate">
                {t.price_disclaimer}
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-4 shrink-0 text-orange-100">
              <span className="flex items-center">
                <PenTool className="w-3 h-3 mr-1 text-amber-300" />
                Digital e-Sign Rental Agreements
              </span>
              <span>•</span>
              <span className="font-semibold text-white">GST Registered All-India Rentals</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                  Bharat<span className="text-orange-600">Wheels</span>
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1 font-semibold tracking-wide">
                  Pan-India Vehicle Rentals
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-xs md:text-sm text-slate-600">
              {[
                { id: 'home', label: t.nav_home },
                { id: 'vehicles', label: t.nav_vehicles },
                { id: 'how-it-works', label: t.nav_how_it_works },
                { id: 'pricing', label: t.nav_pricing },
                {
                  id: 'bookings',
                  label: t.nav_bookings,
                  badge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
                },
                { id: 'about', label: t.nav_about },
                { id: 'contact', label: t.nav_contact },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl transition-all relative ${
                    currentTab === link.id
                      ? 'text-orange-600 font-bold bg-orange-50'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-orange-600 text-white rounded-full text-[10px] font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}

              {/* Admin Portal Tab */}
              <button
                onClick={() => handleNavClick('admin')}
                className={`ml-1 px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                  currentTab === 'admin'
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-orange-500" />
                <span>{t.nav_admin}</span>
              </button>
            </nav>

            {/* Right Tools: Language & Sign In Options */}
            <div className="hidden sm:flex items-center space-x-2.5">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
                {(['en', 'hi', 'mr'] as const).map((langCode) => (
                  <button
                    key={langCode}
                    onClick={() => setLanguage(langCode)}
                    className={`px-2 py-1 rounded-xl text-xs transition-all ${
                      language === langCode
                        ? 'bg-white text-orange-600 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {langCode === 'en' ? 'EN' : langCode === 'hi' ? 'हिंदी' : 'मराठी'}
                  </button>
                ))}
              </div>

              {/* Sign Option (Sign In / Register / Profile) */}
              {isGuest ? (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-orange-600" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-orange-400" />
                    <span className="truncate max-w-[110px]">{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[10px] bg-orange-500 px-1.5 py-0.2 rounded font-mono font-bold">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 text-sm">
            {[
              { id: 'home', label: t.nav_home },
              { id: 'vehicles', label: t.nav_vehicles },
              { id: 'how-it-works', label: t.nav_how_it_works },
              { id: 'pricing', label: t.nav_pricing },
              { id: 'bookings', label: t.nav_bookings },
              { id: 'about', label: t.nav_about },
              { id: 'contact', label: t.nav_contact },
              { id: 'admin', label: t.nav_admin },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-medium flex items-center justify-between ${
                  currentTab === link.id
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.id === 'bookings' && activeBookingsCount > 0 && (
                  <span className="px-2 py-0.5 bg-orange-600 text-white rounded-full text-xs font-bold">
                    {activeBookingsCount}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Language / भाषा:</span>
              <div className="flex space-x-1">
                {(['en', 'hi', 'mr'] as const).map((langCode) => (
                  <button
                    key={langCode}
                    onClick={() => setLanguage(langCode)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      language === langCode ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {langCode === 'en' ? 'English' : langCode === 'hi' ? 'हिंदी' : 'मराठी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sign In / Sign Up Option */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-orange-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="bg-orange-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal with Sign In, Sign Up & Demo Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setCurrentTab('admin');
          }
        }}
        onLogout={handleLogout}
      />
    </>
  );
};
