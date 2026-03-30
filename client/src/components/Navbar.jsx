import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { path: '/projects', label: 'Projects', emoji: '🚀' },
  { path: '/datasets', label: 'Datasets', emoji: '📊' },
  { path: '/events', label: 'Events', emoji: '🎯' },
  { path: '/leaderboard', label: 'Leaderboard', emoji: '🏆' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const close = () => setMobileOpen(false);
  const handleLogout = () => { logout(); close(); navigate('/login'); };

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 md:px-6">
      {/* Backdrop blur bar */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-100" />

      <div className="relative mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={close} className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white text-sm font-black shadow-lg group-hover:scale-105 transition-transform">
            <span>VA</span>
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 opacity-0 group-hover:opacity-30 blur transition-opacity" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">Virudhunagar AI</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Innovation Platform</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-full px-2 py-1.5">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive(path)
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isActive(path) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
              )}
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-700">{user.name.split(' ')[0]}</span>
              </div>
              <Link to="/dashboard" className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="relative md:hidden mt-3 mx-auto max-w-7xl rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-4 space-y-1">
            {NAV_LINKS.map(({ path, label, emoji }) => (
              <Link
                key={path}
                to={path}
                onClick={close}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(path) ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{emoji}</span>
                {label}
                {isActive(path) && <span className="ml-auto w-2 h-2 rounded-full bg-amber-500" />}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-100 p-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link to="/dashboard" onClick={close} className="block w-full text-center py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={close} className="text-center py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700">
                  Login
                </Link>
                <Link to="/register" onClick={close} className="text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
