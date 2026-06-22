import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAPI, categoryAPI } from '../services/api';

export function CreateRequestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    categoryAPI.getAll()
      .then(res => setCategories(res.data))
      .catch(() => setError('Failed to load categories'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestAPI.create({ title, description, category });
      navigate('/requests');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>✍️ Create New Ticket</h2>
        <p style={{ color: '#6b7280' }}>Fill out the form below to create a support ticket</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📌 Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div className="form-group">
            <label>📝 Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your issue..."
              required
              rows="6"
            />
          </div>

          <div className="form-group">
            <label>📁 Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? '⏳ Creating...' : '✓ Create Ticket'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => navigate('/requests')}
              style={{ flex: 1 }}
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
