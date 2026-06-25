import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, MapPin, User, MessageCircle, Mail, Trash2, ArrowLeft, Check, Edit } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API_BASE_URL } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit product form state variables
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) {
          throw new Error('Product not found or failed to retrieve details.');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_BASE_URL]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) {
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Listing deleted successfully.');
        navigate('/products');
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete listing.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = () => {
    if (!product) return;
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditPrice(product.price.toString());
    setEditCategory(product.category);
    setEditLocation(product.location);
    setEditImage(product.image || '');
    setEditError('');
    setShowEditModal(true);
  };

  const handleUpdateListing = async (e) => {
    e.preventDefault();
    if (!editTitle || !editDescription || !editPrice || !editCategory || !editLocation) {
      setEditError('All fields except image URL are required.');
      return;
    }
    const priceVal = parseFloat(editPrice);
    if (isNaN(priceVal) || priceVal <= 0) {
      setEditError('Price must be a valid positive number.');
      return;
    }

    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          price: priceVal,
          category: editCategory,
          location: editLocation,
          image: editImage
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update listing.');
      }

      setProduct(data);
      setShowEditModal(false);
      alert('Product updated successfully.');
    } catch (err) {
      setEditError(err.message || 'Error updating listing.');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '20px' }}>
        <h3 className="heading-sm" style={{ color: 'var(--color-danger)' }}>{error || 'Listing not found'}</h3>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && (product.seller?._id === user.id || product.seller === user.id);
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="page-fade-in container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Back link */}
      <Link to="/products" className="flex-center text-muted" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '24px', width: 'fit-content' }}>
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </Link>

      <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
        
        {/* Product Image Panel */}
        <div style={{ flex: '1 1 450px' }}>
          <div className="glass-card flex-center" style={{ height: '480px', width: '100%', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div className="flex-center" style={{ flexDirection: 'column', color: 'var(--text-muted)', gap: '16px' }}>
                <ShoppingCart size={80} />
                <span>No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            {/* Category Tag */}
            <span className="badge badge-info" style={{ marginBottom: '12px' }}>
              {product.category}
            </span>
            
            <h1 className="heading-md" style={{ fontSize: '2.2rem', marginBottom: '12px', lineHeight: '1.2' }}>{product.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} className="text-secondary" />
                <span>{product.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <User size={16} className="text-primary" />
                <span>Listed by: {product.seller?.username || 'Student'}</span>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Purchase Price</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>₹{product.price.toLocaleString('en-IN')}</p>
              </div>
              
              {/* Actions for Owner or Admin */}
              {(isOwner || isAdmin) && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={openEditModal}
                    className="btn btn-secondary"
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)' }}
                    title="Edit this listing"
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDeleteListing}
                    disabled={deleteLoading}
                    className="btn btn-accent"
                    style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)' }}
                    title="Delete this listing"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '20px', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Quantity:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="btn btn-outline flex-center"
                    style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
                  >-</button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="btn btn-outline flex-center"
                    style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
                  >+</button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn ${addedToCart ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Shopping Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="heading-sm" style={{ marginBottom: '10px' }}>Item Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {product.description}
            </p>
          </div>

          {/* Seller Contact Info Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 className="heading-sm" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} className="text-secondary" />
              <span>Seller Contact Details</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} className="text-muted" />
                <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                <a href={`mailto:${product.seller?.email}`} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                  {product.seller?.email || 'N/A'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={16} className="text-muted" />
                <span style={{ color: 'var(--text-secondary)' }}>Contact / Chat:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {product.seller?.contactDetails || 'No contact number provided.'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Modal Overlay */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container glass-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="heading-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={20} className="text-secondary" />
                <span>Edit Product Listing</span>
              </h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                style={{ color: 'var(--text-muted)', fontSize: '1.5rem', lineHeight: '1' }}
                className="hover:text-primary"
              >
                &times;
              </button>
            </div>

            {editError && (
              <div className="badge badge-danger" style={{ display: 'block', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', width: '100%', textAlign: 'left', textTransform: 'none' }}>
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateListing} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label>Product Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Calculus Textbook, Lab Coat"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="e.g. 500"
                    min="1"
                    step="any"
                    required
                  />
                </div>
                
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Category</label>
                  <select
                    className="form-input"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  >
                    <option value="" disabled>Select category</option>
                    {['Electronics', 'Books', 'Stationery', 'Clothing', 'Others'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Location / Venue</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Main Hostel, Block A"
                    required
                  />
                </div>

                <div className="input-group" style={{ margin: 0 }}>
                  <label>Image URL (Optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label>Description</label>
                <textarea
                  className="form-input"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe the product's condition, usage duration, etc."
                  rows="4"
                  required
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
