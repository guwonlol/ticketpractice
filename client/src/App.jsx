import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RequestListPage } from './pages/RequestListPage';
import { CreateRequestPage } from './pages/CreateRequestPage';
import { RequestDetailsPage } from './pages/RequestDetailsPage';
import { AdminPage } from './pages/AdminPage';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/requests" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/requests" />} />
        <Route path="/" element={user ? <Navigate to="/requests" /> : <Navigate to="/login" />} />

        <Route path="/requests" element={<PrivateRoute><RequestListPage /></PrivateRoute>} />
        <Route path="/requests/create" element={<PrivateRoute><CreateRequestPage /></PrivateRoute>} />
        <Route path="/requests/:id" element={<PrivateRoute><RequestDetailsPage /></PrivateRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
