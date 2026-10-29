import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Lock, Mail, Phone, FileText, MapPin, X, CheckCircle, ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpLicense, setSignUpLicense] = useState('');
  const [signUpCity, setSignUpCity] = useState('Pune');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'customer' | 'admin'>('customer');

  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role: 'customer' | 'admin' = signInEmail.toLowerCase().includes('admin') ? 'admin' : 'customer';
    const user: UserProfile = {
      name: signInEmail.split('@')[0] || 'Customer',
      email: signInEmail,
      phone: '+91 98201 00000',
      role,
      city: 'Mumbai',
    };
    onLoginSuccess(user);
    setToastMessage(`Signed in successfully as ${user.name}!`);
    setTimeout(() => {
      setToastMessage('');
      onClose();
    }, 1000);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      phone: signUpPhone.trim(),
      licenseNumber: signUpLicense.trim(),
      city: signUpCity,
      role: signUpRole,
    };
    onLoginSuccess(newUser);
    setToastMessage(`Registration successful! Welcome, ${newUser.name}.`);
    setTimeout(() => {
      setToastMessage('');
      onClose();
    }, 1000);
  };

  const handleQuickDemoLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      onLoginSuccess({
        name: 'Prasad Ghage (Admin)',
        email: 'prasadghage45@gmail.com',
        phone: '+91 98765 00000',
        role: 'admin',
        city: 'Mumbai',
      });
    } else {
      onLoginSuccess({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '+91 98201 23456',
        licenseNumber: 'MH-14-2022-0045892',
        role: 'customer',
        city: 'Pune',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Customer & Admin Access</h3>
              <p className="text-[11px] text-slate-300">Sign in to manage rentals and bookings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`py-3 px-4 flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'signin'
                ? 'bg-white text-orange-600 border-b-2 border-orange-500 font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-3 px-4 flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-orange-600 border-b-2 border-orange-500 font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up / Register</span>
          </button>
        </div>

        {/* Success message banner */}
        {toastMessage && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2.5 font-bold flex items-center border-b border-emerald-200">
            <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="p-6">
          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center">
                  <Mail className="w-3.5 h-3.5 text-orange-500 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center">
                    <Lock className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    Password *
                  </span>
                  <span className="text-[10px] text-orange-600 cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </label>
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-600" />
                  <span>Remember my login</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* TAB 2: SIGN UP / REGISTER */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center">
                  <User className="w-3.5 h-3.5 text-orange-500 mr-1" />
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Priya Patil"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center">
                    <Mail className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center">
                    <FileText className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    License / Student ID
                  </label>
                  <input
                    type="text"
                    value={signUpLicense}
                    onChange={(e) => setSignUpLicense(e.target.value)}
                    placeholder="MH-12-XXXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    City Location
                  </label>
                  <select
                    value={signUpCity}
                    onChange={(e) => setSignUpCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Goa">Goa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center">
                  <Lock className="w-3.5 h-3.5 text-orange-500 mr-1" />
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('customer')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      signUpRole === 'customer'
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpRole('admin')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      signUpRole === 'admin'
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-orange-500/20"
              >
                <span>Create Account & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider mb-2.5">
              1-Click Demo Sign In (College Project)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center space-x-1"
              >
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span>Demo Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
