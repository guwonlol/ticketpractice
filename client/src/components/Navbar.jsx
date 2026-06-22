import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="navbar">
      <div className="container">
        <strong>🎫 Ticket System</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>{user.name} • <strong>{user.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}</strong></span>
          {user.role === 'admin' && (
            <a onClick={() => navigate('/admin')}>⚙️ Admin Panel</a>
          )}
          <a onClick={() => navigate('/requests')}>📋 My Requests</a>
          <a onClick={handleLogout}>🚪 Logout</a>
        </div>
      </div>
    </div>
  );
}
