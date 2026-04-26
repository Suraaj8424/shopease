import { Navigate } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext';

// Protects routes that need login
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin()) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;