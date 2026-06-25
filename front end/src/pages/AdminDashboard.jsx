import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, ShoppingBag, DollarSign, AlertTriangle, ShieldCheck, UserMinus, UserCheck, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const { token, API_BASE_URL } = useAuth();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!statsRes.ok) throw new Error('Failed to retrieve system statistics.');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch users
      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!usersRes.ok) throw new Error('Failed to retrieve user accounts database.');
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch orders
      const ordersRes = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!ordersRes.ok) throw new Error('Failed to retrieve order logs.');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Access denied or server connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, API_BASE_URL]);

  const handleToggleBan = async (userId, currentBanStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentBanStatus ? 're-activate' : 'suspend/ban'} this user account?`)) {
      return;
    }
    
    setActionLoadingId(userId);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isBanned: !currentBanStatus })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Refresh users list and stats
        fetchData();
      } else {
        throw new Error(data.message || 'Operation failed.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order as an Administrator? This action cannot be undone.')) {
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
        fetchData();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to cancel order.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
        <RefreshCw className="animate-spin text-secondary" size={32} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading Admin Control Console...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
        <ShieldAlert size={48} className="text-danger" />
        <h3 className="heading-sm" style={{ color: 'var(--color-danger)' }}>{error}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>You must be logged in as an Administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="page-fade-in container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <ShieldAlert size={36} style={{ color: 'var(--color-warning)' }} />
        <div>
          <h1 className="heading-md" style={{ margin: 0 }}>Admin <span className="text-gradient">Console</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>System-wide user moderation, moderation controls, and sales overview</p>
        </div>
      </div>

      {/* Analytics stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {/* Total Users */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Registered Users</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.totalUsers}</p>
          </div>
        </div>

        {/* Total Listings */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--color-secondary)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Listings</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.totalProducts}</p>
          </div>
        </div>

        {/* Total Sales volume */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sales Volume</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>₹{stats?.totalSales.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* User Accounts Management Database */}
      <h2 className="heading-sm" style={{ marginBottom: '20px' }}>User Accounts Moderation</h2>
      
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>User ID</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Username</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'var(--transition-fast)' }} className="hover-row">
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.id}</td>
                <td style={{ padding: '16px 20px', fontWeight: 500 }}>{u.username}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {u.isBanned ? (
                    <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                      <AlertTriangle size={10} />
                      Suspended
                    </span>
                  ) : (
                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                      <ShieldCheck size={10} />
                      Active
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  {u.role !== 'admin' ? (
                    <button
                      onClick={() => handleToggleBan(u.id, u.isBanned)}
                      disabled={actionLoadingId === u.id}
                      className="btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        background: u.isBanned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: u.isBanned ? 'var(--color-success)' : 'var(--color-danger)',
                        border: `1px solid ${u.isBanned ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        justifyContent: 'center',
                        minWidth: '100px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {actionLoadingId === u.id ? (
                        <span>Processing...</span>
                      ) : u.isBanned ? (
                        <>
                          <UserCheck size={14} />
                          <span>Unban</span>
                        </>
                      ) : (
                        <>
                          <UserMinus size={14} />
                          <span>Suspend</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Global Transaction Logs */}
      <h2 className="heading-sm" style={{ marginTop: '48px', marginBottom: '20px' }}>Global Transaction Logs</h2>
      
      <div className="glass-card" style={{ overflowX: 'auto', marginBottom: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Order ID</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Buyer</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Items Purchased</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Total</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Shipping Destination</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No orders have been placed on the platform yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id || o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover-row">
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o._id || o.id}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 500 }}>{o.buyer?.username || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.buyer?.email}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {o.items.map((item, idx) => (
                        <div key={idx}>
                          <strong>{item.product?.title || 'Unknown Product'}</strong> (Qty: {item.quantity})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--color-secondary)' }}>
                    ₹{o.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div>{o.shippingAddress?.fullName}</div>
                    <div>{o.shippingAddress?.addressLine}, {o.shippingAddress?.city}</div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.85rem' }}>
                    <div style={{ marginBottom: '6px' }}>
                      <span className={`badge ${
                        o.paymentStatus === 'Completed' ? 'badge-success' : 
                        o.paymentStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {o.paymentStatus}
                      </span>
                    </div>
                    {o.paymentStatus !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelOrder(o._id || o.id)}
                        className="btn"
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--color-danger)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .hover-row:hover {
          background: rgba(255,255,255,0.01);
        }
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
