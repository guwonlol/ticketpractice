import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container"><p>Loading...</p></div>;
  return user ? children : <Navigate to="/login" />;
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container"><p>Loading...</p></div>;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}
