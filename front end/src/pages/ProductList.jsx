import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Grid, ShoppingBag, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function ProductList() {
  const { API_BASE_URL } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local filter states synchronized with URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');
  const [categoryTerm, setCategoryTerm] = useState(searchParams.get('category') || '');

  // Fetch products whenever searchParams change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const query = new URLSearchParams(searchParams).toString();
        const res = await fetch(`${API_BASE_URL}/products?${query}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve listings.');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to connect to the backend server.');
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [searchParams, API_BASE_URL]);

  // Sync URL search params with state
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setLocationTerm(searchParams.get('location') || '');
    setCategoryTerm(searchParams.get('category') || '');
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (locationTerm) params.location = locationTerm;
    if (categoryTerm) params.category = categoryTerm;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocationTerm('');
    setCategoryTerm('');
    setSearchParams({});
  };

  const categories = ['Electronics', 'Books', 'Stationery', 'Clothing', 'Others'];

  return (
    <div className="page-fade-in container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Title & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="heading-md" style={{ marginBottom: '8px' }}>Community <span className="text-gradient">Marketplace</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Showing {products.length} {products.length === 1 ? 'listing' : 'listings'} available for purchase
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* Filter Panel */}
        <aside style={{ flex: '1 1 280px', maxWidth: '340px' }}>
          <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div className="flex-center" style={{ gap: '8px', fontWeight: 600 }}>
                <SlidersHorizontal size={18} className="text-secondary" />
                <span>Filters</span>
              </div>
              <button onClick={handleClearFilters} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="hover:text-primary">
                Clear All
              </button>
            </div>

            <form onSubmit={handleApplyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Keyword Search */}
              <div className="input-group" style={{ margin: 0 }}>
                <label>Keyword Search</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px', width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div className="input-group" style={{ margin: 0 }}>
                <label>Campus Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Hostel block 3, Library"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px', width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="input-group" style={{ margin: 0 }}>
                <label>Category</label>
                <select
                  value={categoryTerm}
                  onChange={(e) => setCategoryTerm(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)' }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Listings Section */}
        <main style={{ flex: '3 1 600px' }}>
          {loading ? (
            <div className="glass-card flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
              <RefreshCw className="animate-spin text-secondary" size={32} />
              <p style={{ color: 'var(--text-secondary)' }}>Fetching listings from marketplace...</p>
            </div>
          ) : error ? (
            <div className="glass-card flex-center" style={{ minHeight: '400px', padding: '40px', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--color-danger)' }}>{error}</p>
              <button onClick={() => setSearchParams({})} className="btn btn-outline">
                Reset Marketplace View
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card flex-center" style={{ minHeight: '400px', padding: '60px', flexDirection: 'column', gap: '20px' }}>
              <ShoppingBag size={48} className="text-muted" />
              <div style={{ textAlign: 'center' }}>
                <h3 className="heading-sm" style={{ marginBottom: '8px' }}>No Listings Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We couldn't find any products matching your filters.</p>
              </div>
              <button onClick={handleClearFilters} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px'
            }}>
              {products.map((product) => (
                <Link to={`/products/${product._id || product.id}`} key={product._id || product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'relative', width: '100%', height: '180px', background: 'var(--bg-tertiary)' }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="flex-center" style={{ width: '100%', height: '100%', color: 'var(--text-muted)' }}>
                        <ShoppingBag size={40} />
                      </div>
                    )}
                    <span className="badge badge-info" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                      {product.category}
                    </span>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {product.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        <MapPin size={12} />
                        <span>{product.location}</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Seller: {product.seller?.username || 'Student'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
