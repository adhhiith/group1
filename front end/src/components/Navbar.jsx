import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, LogOut, LogIn, ShieldAlert, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header-glass">
      <div className="container navbar">
        {/* Logo */}
        <Link to="/" className="logo">
          <ShoppingBag className="text-gradient" size={28} />
          <span>Providence <span className="text-gradient">Kozhikode</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Marketplace
          </NavLink>
          {user && (
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              My Listings
            </NavLink>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="flex-center" style={{ position: 'relative', padding: '8px' }}>
            <ShoppingCart size={22} className="text-secondary" />
            {getCartCount() > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--color-accent)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 2s infinite'
                }}
              >
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Admin Dashboard link */}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <ShieldAlert size={16} style={{ color: 'var(--color-warning)' }} />
              <span>Admin</span>
            </Link>
          )}

          {/* User Profile / Login Toggle */}
          {user ? (
            <div className="flex-center" style={{ gap: '16px' }}>
              <Link to="/profile" className="flex-center" style={{ gap: '8px' }}>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-primary)' }}
                  />
                ) : (
                  <div
                    className="flex-center"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {user.username}
                </span>
              </Link>
              <button onClick={handleLogout} className="flex-center" style={{ padding: '6px', color: '#ffffff' }} title="Logout">
                <LogOut size={20} className="hover:text-accent" />
              </button>
            </div>
          ) : (
            <div className="flex-center" style={{ gap: '12px' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(244, 63, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
      `}</style>
    </header>
  );
}
