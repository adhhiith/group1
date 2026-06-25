import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { token, API_BASE_URL } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  // Credit Card Form State
  const [payment, setPayment] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.postalCode) {
      setError('Please fill in all address fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!payment.cardNumber || !payment.cardHolder || !payment.expiry || !payment.cvv) {
      setError('Please fill in all credit card fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product._id || item.product.id,
        quantity: item.quantity,
        price: item.price
      }));

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: getCartTotal(),
          shippingAddress
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to place order.');
      }

      // Order success
      clearCart();
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during payment processing.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="container flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '20px' }}>
        <h3 className="heading-sm">Your cart is empty. Please add items before checking out.</h3>
        <Link to="/products" className="btn btn-primary">Browse Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="page-fade-in container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Step Indicators */}
      {step !== 3 && (
        <div className="flex-center" style={{ gap: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 1 ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step === 1 ? 'var(--color-primary-glow)' : 'var(--bg-tertiary)',
              border: `1px solid ${step === 1 ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              fontWeight: 600
            }} className="flex-center">1</span>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Shipping Details</span>
          </div>
          
          <div style={{ width: '60px', height: '1px', background: 'var(--glass-border)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 2 ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step === 2 ? 'var(--color-primary-glow)' : 'var(--bg-tertiary)',
              border: `1px solid ${step === 2 ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              fontWeight: 600
            }} className="flex-center">2</span>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Secure Payment</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      {step === 1 && (
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="glass-card" style={{ flex: '1 1 500px', maxWidth: '600px', padding: '32px' }}>
            <h2 className="heading-sm" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} className="text-secondary" />
              <span>Campus Shipping Address</span>
            </h2>

            <form onSubmit={handleShippingSubmit}>
              <div className="input-group">
                <label>Receiver Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rithu S"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <label>Hostel / Department / Delivery Point</label>
                <input
                  type="text"
                  placeholder="e.g. Room 402, PG Hostel, Providence Kozhikode"
                  value={shippingAddress.addressLine}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="Kozhikode"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Postal/ZIP Code</label>
                  <input
                    type="text"
                    placeholder="673009"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <Link to="/cart" className="flex-center text-muted" style={{ gap: '8px' }}>
                  <ArrowLeft size={16} />
                  <span>Return to Cart</span>
                </Link>
                
                <button type="submit" className="btn btn-primary">
                  <span>Continue to Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          {/* Card Mockup (Left Panel) */}
          <div style={{ flex: '1 1 360px', maxWidth: '400px' }}>
            {/* Interactive Credit Card Widget */}
            <div className="glass-card" style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(20,184,166,0.2) 100%)',
              borderColor: 'rgba(255,255,255,0.15)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              height: '220px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px' }} />
                <Lock size={20} className="text-secondary" />
              </div>

              <div>
                <p style={{
                  fontSize: '1.35rem',
                  letterSpacing: '3px',
                  fontWeight: 600,
                  color: 'white',
                  fontFamily: 'monospace',
                  marginBottom: '16px'
                }}>
                  {payment.cardNumber || '•••• •••• •••• ••••'}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)' }}>Card Holder</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>{payment.cardHolder || 'FULL NAME'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)' }}>Expiry</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>{payment.expiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <p style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} className="text-success" />
                <span>Simulated secure integration. No real charges are made.</span>
              </p>
            </div>
          </div>

          {/* Payment Form (Right Panel) */}
          <div className="glass-card" style={{ flex: '1 1 450px', maxWidth: '500px', padding: '32px' }}>
            <h2 className="heading-sm" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} className="text-primary" />
              <span>Simulated Payment Gateway</span>
            </h2>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-danger)', fontSize: '0.85rem', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit}>
              <div className="input-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 1234 5678"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19) })}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  placeholder="Card holder's full name"
                  value={payment.cardHolder}
                  onChange={(e) => setPayment({ ...payment, cardHolder: e.target.value.toUpperCase() })}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={(e) => setPayment({ ...payment, expiry: e.target.value.replace(/\W/gi, '').replace(/(.{2})/g, '$1/').replace(/\/$/, '').substring(0, 5) })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>CVV / CVC Code</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={payment.cvv}
                    onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <button type="button" onClick={() => setStep(1)} className="flex-center text-muted" style={{ gap: '8px' }}>
                  <ArrowLeft size={16} />
                  <span>Back to Shipping</span>
                </button>
                
                <button type="submit" className="btn btn-secondary" disabled={loading} style={{ padding: '12px 24px' }}>
                  {loading ? 'Authorizing...' : `Pay ₹${getCartTotal().toLocaleString('en-IN')}`}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {step === 3 && (
        <div className="flex-center" style={{ minHeight: 'calc(100vh - 280px)', flexDirection: 'column', gap: '28px' }}>
          <div className="flex-center" style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--color-success)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <CheckCircle size={56} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1 className="heading-lg" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Order Placed successfully!</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: '1.6' }}>
              Thank you for shopping at Providence Kozhikode Marketplace. Your transaction was simulated successfully and the order is registered.
            </p>
          </div>

          <div className="flex-center" style={{ gap: '16px' }}>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
            <Link to="/profile" className="btn btn-outline">
              Check Order History
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.3); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
