import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '48px 0 24px 0',
      marginTop: '80px',
      color: 'var(--text-secondary)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand */}
        <div style={{ flex: '1 1 300px' }}>
          <Link to="/" className="logo" style={{ color: 'var(--text-primary)', marginBottom: '16px', display: 'inline-flex' }}>
            <ShoppingBag className="text-gradient" size={24} />
            <span>Providence <span className="text-gradient">Kozhikode</span></span>
          </Link>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '320px' }}>
            The premier student and client marketplace for Providence College, Kozhikode. Buy and sell products locally in a secure, intuitive environment.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '60px' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marketplace</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/products" style={{ color: 'inherit' }} className="hover:text-primary">All Products</Link></li>
              <li><Link to="/products?category=Electronics" style={{ color: 'inherit' }} className="hover:text-primary">Electronics</Link></li>
              <li><Link to="/products?category=Books" style={{ color: 'inherit' }} className="hover:text-primary">Books</Link></li>
              <li><Link to="/products?category=Stationery" style={{ color: 'inherit' }} className="hover:text-primary">Stationery</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Help & Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><a href="#" style={{ color: 'inherit' }}>Terms of Use</a></li>
              <li><a href="#" style={{ color: 'inherit' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: 'inherit' }}>Support Desk</a></li>
              <li><a href="#" style={{ color: 'inherit' }}>Contact Admin</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container" style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '24px',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <p>&copy; {new Date().getFullYear()} Providence Kozhikode FSD Project. All Rights Reserved. Crafted with React & Node.</p>
      </div>
    </footer>
  );
}
