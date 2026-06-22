import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAPI, categoryAPI } from '../services/api';

export function RequestListPage() {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    loadRequests();
  }, [page, status, category, search]);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (search) filters.search = search;
      const res = await requestAPI.getMyRequests(filters, page, 10);
      setRequests(res.data.requests);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await requestAPI.delete(id);
      loadRequests();
    } catch (err) {
      setError('Failed to delete request');
    }
  };

  const getStatusClass = (s) => {
    const map = { 'New': 'new', 'In Progress': 'progress', 'Resolved': 'resolved', 'Rejected': 'rejected' };
    return map[s] || '';
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📋 My Tickets</h2>
        <button onClick={() => navigate('/requests/create')} style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
          ➕ Create Ticket
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h4>🔍 Filters</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
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

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>⏳ Loading...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>📭 No tickets found</p>
        </div>
      ) : (
        <>
          {requests.map(req => (
            <div
              key={req._id}
              className="request-item"
              onClick={() => navigate(`/requests/${req._id}`)}
            >
              <div className="request-header">
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{req.title}</h3>
                  <small>{req.description.substring(0, 80)}...</small>
                </div>
                <span className={`status ${getStatusClass(req.status)}`}>{req.status}</span>
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280' }}>
                <span>📁 {req.category?.name || 'N/A'}</span>
                <span>📅 {new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              ← Previous
            </button>
            <span style={{ padding: '0.5rem 1rem', alignSelf: 'center' }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={requests.length < 10}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
