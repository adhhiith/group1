import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!user) {
      // Redirect to login, but save that we want to go to checkout after login
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-fade-in container flex-center" style={{ minHeight: 'calc(100vh - 240px)', padding: '40px 20px', flexDirection: 'column', gap: '24px' }}>
        <div className="flex-center" style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          color: 'var(--color-primary)',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <ShoppingCart size={40} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 className="heading-sm" style={{ marginBottom: '8px', fontSize: '1.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            Looks like you haven't added any products to your cart yet. Browse our marketplace to find student essentials.
          </p>
        </div>
        <Link to="/products" className="btn btn-primary">
          <span>Explore Marketplace</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="page-fade-in container" style={{ padding: '40px 0 80px 0' }}>
      <h1 className="heading-md" style={{ marginBottom: '32px' }}>Shopping <span className="text-gradient">Cart</span></h1>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Cart items list */}
        <div style={{ flex: '3 1 600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.map((item) => {
            const prod = item.product;
            return (
              <div key={prod._id || prod.id} className="glass-card" style={{ display: 'flex', padding: '20px', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Product Image */}
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0 }} className="flex-center">
                  {prod.image ? (
                    <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ShoppingBag size={24} className="text-muted" />
                  )}
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1, minWidth: '200px' }}>
                  <Link to={`/products/${prod._id || prod.id}`} style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }} className="hover:text-primary">
                    {prod.title}
                  </Link>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Category: {prod.category}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '4px' }}>
                    ₹{item.price.toLocaleString('en-IN')} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex-center" style={{ gap: '12px' }}>
                  <button
                    onClick={() => updateQuantity(prod._id || prod.id, item.quantity - 1)}
                    className="btn btn-outline flex-center"
                    style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%' }}
                  >-</button>
                  <span style={{ fontWeight: 600, width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(prod._id || prod.id, item.quantity + 1)}
                    className="btn btn-outline flex-center"
                    style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%' }}
                  >+</button>
                </div>

                {/* Subtotal */}
                <div style={{ width: '100px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(prod._id || prod.id)}
                  style={{ color: 'var(--text-muted)' }}
                  className="hover:text-accent"
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary Side Card */}
        <div style={{ flex: '1 1 320px', maxWidth: '400px', width: '100%' }}>
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 className="heading-sm" style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({cartItems.reduce((acc, val) => acc + val.quantity, 0)} items)</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Campus Handover</span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Taxes</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹0.00</span>
              </div>
              
              <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '10px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-secondary)' }}>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '24px', padding: '14px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            {/* Secure Badge */}
            <div className="flex-center" style={{ gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
              <span>Campus Secure Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
