import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Image, AlertTriangle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [contactDetails, setContactDetails] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(username, email, password, role, contactDetails, profilePicture);
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Try using a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in flex-center" style={{ minHeight: 'calc(100vh - 200px)', padding: '40px 20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '40px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="flex-center" style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(20, 184, 166, 0.1)',
            color: 'var(--color-secondary)',
            margin: '0 auto 16px auto',
            border: '1px solid rgba(20, 184, 166, 0.2)'
          }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sign up to buy and sell products on campus</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Grid Layout for name/email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label htmlFor="username">Username *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '48px', width: '100%' }}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '48px', width: '100%' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '48px', width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Account Role */}
          <div className="input-group">
            <label htmlFor="role">Account Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
              style={{ width: '100%', appearance: 'none', background: 'rgba(15, 22, 38, 0.7)' }}
            >
              <option value="client">Client / Student (Buy & Sell)</option>
              <option value="admin">Administrator (Full Control)</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="contact">Contact Details</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="contact"
                type="text"
                placeholder="Phone number, WhatsApp link"
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '48px', width: '100%' }}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="profilePic">Profile Picture URL</label>
            <div style={{ position: 'relative' }}>
              <Image size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="profilePic"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '48px', width: '100%' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
