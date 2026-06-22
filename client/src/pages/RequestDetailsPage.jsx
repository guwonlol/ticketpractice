import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestAPI, categoryAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [req, hist, cats] = await Promise.all([
          requestAPI.getById(id),
          requestAPI.getHistory(id),
          categoryAPI.getAll()
        ]);
        setRequest(req.data);
        setHistory(hist.data);
        setCategories(cats.data);
        setTitle(req.data.title);
        setDescription(req.data.description);
        setCategory(req.data.category._id);
      } catch (err) {
        setError('Failed to load request');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await requestAPI.update(id, { title, description, category });
      setRequest(updated.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await requestAPI.delete(id);
      navigate('/requests');
    } catch (err) {
      setError('Failed to delete request');
    }
  };

  if (loading) return <div className="container"><p style={{ textAlign: 'center', padding: '2rem' }}>⏳ Loading...</p></div>;
  if (!request) return <div className="container"><p style={{ textAlign: 'center', padding: '2rem' }}>❌ Ticket not found</p></div>;

  const canEdit = request.status === 'New' && user?.id === request.owner._id;
  const canDelete = request.status === 'New' && user?.id === request.owner._id;
  const getStatusClass = (s) => {
    const map = { 'New': 'new', 'In Progress': 'progress', 'Resolved': 'resolved', 'Rejected': 'rejected' };
    return map[s] || '';
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      {error && <div className="alert error">{error}</div>}

      <div style={{ marginBottom: '2rem' }}>
        <button className="secondary" onClick={() => navigate('/requests')} style={{ marginBottom: '1rem' }}>← Back to Tickets</button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>{request.title}</h2>
            <small style={{ color: '#6b7280' }}>Created by <strong>{request.owner?.name}</strong> on {new Date(request.createdAt).toLocaleString()}</small>
          </div>
          <span className={`status ${getStatusClass(request.status)}`}>{request.status}</span>
        </div>

        {!isEditing ? (
          <>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>📝 Description</h4>
              <p>{request.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <strong>📁 Category</strong>
                <p>{request.category?.name}</p>
              </div>
              <div>
                <strong>📅 Last Updated</strong>
                <p>{new Date(request.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="form-actions">
              {canEdit && (
                <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
              )}
              {canDelete && (
                <button className="danger" onClick={handleDelete}>🗑️ Delete</button>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>📌 Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>📝 Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="5" />
            </div>
            <div className="form-group">
              <label>📁 Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">✓ Save Changes</button>
              <button type="button" className="secondary" onClick={() => setIsEditing(false)}>✕ Cancel</button>
            </div>
          </form>
        )}
      </div>

      {history.length > 0 && (
        <div className="card">
          <h3>📋 Status History</h3>
          {history.map((h, idx) => (
            <div key={idx} style={{ padding: '1rem', borderBottom: idx < history.length - 1 ? '1px solid #e5e7eb' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`status ${getStatusClass(h.oldStatus)}`}>{h.oldStatus}</span>
              <span style={{ color: '#6b7280' }}>→</span>
              <span className={`status ${getStatusClass(h.newStatus)}`}>{h.newStatus}</span>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <small style={{ color: '#6b7280' }}>by <strong>{h.changedBy?.name}</strong></small><br/>
                <small style={{ color: '#9ca3af' }}>{new Date(h.changedAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
