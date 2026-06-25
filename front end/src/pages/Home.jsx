import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ArrowRight, Laptop, BookOpen, PenTool, Shirt, Grid, Sparkles, MapPin } from 'lucide-react';

export default function Home() {
  const { API_BASE_URL } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          // Get the latest 4 items
          setFeaturedProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [API_BASE_URL]);

  const categories = [
    { name: 'Electronics', icon: Laptop, color: 'var(--color-primary)' },
    { name: 'Books', icon: BookOpen, color: 'var(--color-secondary)' },
    { name: 'Stationery', icon: PenTool, color: 'var(--color-success)' },
    { name: 'Clothing', icon: Shirt, color: 'var(--color-accent)' },
    { name: 'Others', icon: Grid, color: 'var(--color-warning)' }
  ];

  return (
    <div className="page-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Hero Section */}
      <section style={{
        padding: '100px 0 80px 0',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="flex-center" style={{ gap: '8px', marginBottom: '16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 16px', borderRadius: '9999px', display: 'inline-flex' }}>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '1px' }}>Providence Kozhikode FSD Project</span>
          </div>

          <h1 className="heading-lg" style={{ maxWidth: '800px', margin: '0 auto 20px auto', fontSize: '3.8rem' }}>
            The Ultimate Marketplace for <br />
            <span className="text-gradient">Providence Campus</span>
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.7'
          }}>
            Explore listings, purchase student essentials, and sell your own goods or services in a secure, intuitive environment designed exclusively for Providence.
          </p>

          <div className="flex-center" style={{ gap: '16px' }}>
            <Link to="/products" className="btn btn-primary">
              <span>Browse Marketplace</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/profile" className="btn btn-outline">
              <span>Start Selling</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="heading-md">Browse by <span className="text-gradient">Category</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Find exactly what you need quickly and efficiently</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/products?category=${cat.name}`}
                  className="glass-card flex-center"
                  style={{
                    flexDirection: 'column',
                    padding: '32px 24px',
                    textAlign: 'center',
                    gap: '16px'
                  }}
                >
                  <div className="flex-center" style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    background: `rgba(${cat.color === 'var(--color-primary)' ? '99, 102, 241' : cat.color === 'var(--color-secondary)' ? '20, 184, 166' : '16, 185, 129'}, 0.1)`,
                    color: cat.color,
                    border: `1px solid ${cat.color}22`
                  }}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Explore item listings</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px'
          }}>
            <div>
              <h2 className="heading-md">Featured <span className="text-gradient">Listings</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>Check out some of the latest listings in our community</p>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '200px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading latest listings...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="glass-card flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '20px' }}>
              <ShoppingBag size={48} className="text-muted" />
              <div style={{ textAlign: 'center' }}>
                <h3 className="heading-sm" style={{ marginBottom: '8px' }}>No Listings Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Be the first to list a product for sale!</p>
              </div>
              <Link to="/profile" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                Create a Listing
              </Link>
            </div>
          ) : (
            <div className="grid-cols-4">
              {featuredProducts.map((product) => (
                <Link to={`/products/${product._id || product.id}`} key={product._id || product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'relative', width: '100%', height: '200px', background: 'var(--bg-tertiary)' }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="flex-center" style={{ width: '100%', height: '100%', color: 'var(--text-muted)' }}>
                        <ShoppingBag size={48} />
                      </div>
                    )}
                    <span className="badge badge-info" style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                      {product.category}
                    </span>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {product.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <MapPin size={12} />
                        <span>{product.location}</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          By: {product.seller?.username || 'Seller'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
