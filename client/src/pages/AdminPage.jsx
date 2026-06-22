import { useState, useEffect } from 'react';
import { requestAPI, categoryAPI } from '../services/api';

export function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    loadData();
  }, [page, status, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (status) filters.status = status;
      if (search) filters.search = search;
      const [allReq, cats, s] = await Promise.all([
        requestAPI.getAllRequests(filters, page, 10),
        categoryAPI.getAll(),
        requestAPI.getStatistics()
      ]);
      setRequests(allReq.data.requests);
      setCategories(cats.data);
      setStats(s.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await requestAPI.changeStatus(id, newStatus);
      loadData();
    } catch (err) {
      setError('Failed to change status');
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    try {
      await categoryAPI.create({ name: newCatName, description: newCatDesc });
      setNewCatName('');
      setNewCatDesc('');
      loadData();
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await categoryAPI.delete(id);
      loadData();
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const getStatusClass = (s) => {
    const map = { 'New': 'new', 'In Progress': 'progress', 'Resolved': 'resolved', 'Rejected': 'rejected' };
    return map[s] || '';
  };

  return (
    <div className="container">
      <h2>⚙️ Admin Panel</h2>
      {error && <div className="alert error">{error}</div>}

      <div className="grid">
        <div className="stat-card">
          <h3>📊 Total Tickets</h3>
          <div className="number">{stats.total || 0}</div>
        </div>
        <div className="stat-card">
          <h3>🆕 New</h3>
          <div className="number">{stats.byStatus?.['New'] || 0}</div>
        </div>
        <div className="stat-card">
          <h3>⏳ In Progress</h3>
          <div className="number">{stats.byStatus?.['In Progress'] || 0}</div>
        </div>
        <div className="stat-card">
          <h3>✅ Resolved</h3>
          <div className="number">{stats.byStatus?.['Resolved'] || 0}</div>
        </div>
        <div className="stat-card">
          <h3>❌ Rejected</h3>
          <div className="number">{stats.byStatus?.['Rejected'] || 0}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3>🎫 Manage Tickets</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Status Filter</label>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3>📋 Tickets List</h3>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>⏳ Loading...</p>
        ) : (
          <>
            {requests.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>📭 No tickets found</p>
            ) : (
              requests.map(req => (
                <div key={req._id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <strong>{req.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>by {req.owner?.name}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>{req.description.substring(0, 60)}...</p>
                    <small style={{ color: '#9ca3af' }}>📁 {req.category?.name} • 📅 {new Date(req.createdAt).toLocaleDateString()}</small>
                  </div>
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                    style={{ padding: '0.5rem', minWidth: '150px' }}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              ))
            )}
            <div className="pagination" style={{ marginTop: '1rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Previous</button>
              <span style={{ padding: '0.5rem 1rem' }}>Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={requests.length < 10}>Next →</button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h3>📁 Manage Categories</h3>
        {!showCategories ? (
          <button onClick={() => setShowCategories(true)}>👁️ Show Categories</button>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
              <h4>➕ Add New Category</h4>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g., Technical Issue, Feature Request"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <button onClick={handleAddCategory} style={{ marginRight: '0.5rem' }}>✓ Add</button>
              <button className="secondary" onClick={() => setShowCategories(false)}>✕ Hide</button>
            </div>

            <h4 style={{ marginTop: '1.5rem' }}>📂 Existing Categories</h4>
            {categories.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No categories yet</p>
            ) : (
              categories.map(cat => (
                <div key={cat._id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
                  <div>
                    <strong>{cat.name}</strong>
                    {cat.description && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#6b7280' }}>{cat.description}</p>}
                  </div>
                  <button className="danger" onClick={() => handleDeleteCategory(cat._id)} style={{ padding: '0.5rem 1rem' }}>🗑️ Delete</button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
