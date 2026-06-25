import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, History, Settings, Plus, Sparkles, MapPin, RefreshCw, Trash2, Mail, Phone, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, token, updateProfile, API_BASE_URL } = useAuth();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'orders', 'settings'
  
  // Listings state
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile Form state
  const [username, setUsername] = useState(user?.username || '');
  const [contactDetails, setContactDetails] = useState(user?.contactDetails || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Create Listing Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    location: '',
    image: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Fetch Listings
  const fetchListings = async () => {
    if (!user) return;
    setListingsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products?seller=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListingsLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchOrders();
  }, [user, API_BASE_URL]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      await updateProfile({ username, contactDetails, profilePicture });
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg(`Error: ${err.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.location) {
      setAddError('All fields marked with * are required.');
      return;
    }
    setAddError('');
    setAddLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create listing.');
      }

      // Success
      setShowAddForm(false);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        category: 'Electronics',
        location: '',
        image: ''
      });
      fetchListings();
      alert('Product listed successfully!');
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteListing = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/products/${prodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchListings();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Completed') return 'badge-success';
    if (status === 'Pending') return 'badge-warning';
    if (status === 'Cancelled') return 'badge-danger';
    return 'badge-danger';
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Order cancelled successfully.');
        fetchOrders();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to cancel order.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-fade-in container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Header Profile card */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div className="flex-center" style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          flexShrink: 0,
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.username.charAt(0).toUpperCase()
          )}
        </div>

        {/* Username/Email info */}
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="heading-sm" style={{ fontSize: '1.8rem', margin: 0 }}>{user?.username}</h1>
            <span className="badge badge-info">{user?.role}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} />
              <span>{user?.email}</span>
            </span>
            {user?.contactDetails && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} />
                <span>{user.contactDetails}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', gap: '8px', marginBottom: '32px' }}>
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-center`}
          style={{
            padding: '12px 20px',
            borderBottom: activeTab === 'listings' ? '2px solid var(--color-primary)' : 'none',
            color: activeTab === 'listings' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            gap: '8px'
          }}
        >
          <ShoppingBag size={18} />
          <span>My Listings ({listings.length})</span>
        </button>
        
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-center`}
          style={{
            padding: '12px 20px',
            borderBottom: activeTab === 'orders' ? '2px solid var(--color-primary)' : 'none',
            color: activeTab === 'orders' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            gap: '8px'
          }}
        >
          <History size={18} />
          <span>Order History ({orders.length})</span>
        </button>

        {user?.role !== 'admin' && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-center`}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'settings' ? '2px solid var(--color-primary)' : 'none',
              color: activeTab === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              gap: '8px'
            }}
          >
            <Settings size={18} />
            <span>Profile Settings</span>
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === 'listings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="heading-sm">Active Product Listings</h2>
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Plus size={16} />
              <span>Create Listing</span>
            </button>
          </div>

          {/* Create Listing overlay modal */}
          {showAddForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '32px', maxRank: '90vh', overflowY: 'auto' }}>
                <h3 className="heading-sm" style={{ marginBottom: '20px' }}>List an Item for Sale</h3>
                {addError && <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '12px' }}>{addError}</div>}
                
                <form onSubmit={handleCreateProduct}>
                  <div className="input-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Scientific Calculator FX-991ES"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Description *</label>
                    <textarea
                      placeholder="Details about condition, age, usage..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="form-input"
                      style={{ height: '100px', resize: 'vertical' }}
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="input-group">
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        placeholder="500"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="form-input"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Campus Location / Handover Point *</label>
                    <input
                      type="text"
                      placeholder="e.g. Science block reception / Canteen"
                      value={newProduct.location}
                      onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/item.jpg"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={addLoading}>
                      {addLoading ? 'Publishing...' : 'Publish Listing'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Active listings cards list */}
          {listingsLoading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading your listings...</p>
          ) : listings.length === 0 ? (
            <div className="glass-card flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>You don't have any active listings right now.</p>
              <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {listings.map((prod) => (
                <div key={prod._id || prod.id} className="glass-card" style={{ display: 'flex', padding: '20px', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0 }} className="flex-center">
                    {prod.image ? (
                      <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ShoppingBag size={24} className="text-muted" />
                    )}
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontWeight: 600, fontSize: '1.05rem' }}>{prod.title}</h4>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span className="badge badge-info">{prod.category}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MapPin size={12} />{prod.location}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>

                  <button
                    onClick={() => handleDeleteListing(prod._id || prod.id)}
                    className="btn btn-outline"
                    style={{ padding: '8px 12px', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)' }}
                    title="Delete Listing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="heading-sm" style={{ marginBottom: '24px' }}>Your Purchase History</h2>

          {ordersLoading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="glass-card flex-center" style={{ padding: '60px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>You haven't purchased anything yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orders.map((order) => (
                <div key={order._id || order.id} className="glass-card" style={{ padding: '24px' }}>
                  
                  {/* Order header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', borderBottom: '1px solid var(--glass-border)', paddingBottom: '14px', marginBottom: '16px', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER ID</p>
                      <p style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>{order._id || order.id}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATE PLACED</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER STATUS</p>
                      <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`} style={{ fontSize: '0.65rem' }}>{order.paymentStatus}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER TOTAL</p>
                      <p style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '1rem' }}>₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Order items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product?.title || 'Unknown Product'}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity} | Location: {item.product?.location || 'Campus'}</p>
                        </div>
                        <p style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', padding: '12px', marginTop: '16px', fontSize: '0.85rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Delivery Destination Details</p>
                    <p style={{ color: 'var(--text-primary)' }}>
                      <strong>{order.shippingAddress?.fullName}</strong> — {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}
                    </p>
                  </div>

                  {/* Cancel Order Action */}
                  {order.paymentStatus !== 'Cancelled' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <button
                        onClick={() => handleCancelOrder(order._id || order.id)}
                        className="btn btn-accent"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <h2 className="heading-sm" style={{ marginBottom: '24px' }}>Update Profile Details</h2>
            
            {profileMsg && (
              <div style={{
                background: profileMsg.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${profileMsg.includes('Error') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                color: profileMsg.includes('Error') ? 'var(--color-danger)' : 'var(--color-success)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="input-group">
                <label>Display Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <label>Contact Details (Phone / Social Link)</label>
                <input
                  type="text"
                  placeholder="e.g. Phone: +91 9876543210"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={profileLoading} style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                {profileLoading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
