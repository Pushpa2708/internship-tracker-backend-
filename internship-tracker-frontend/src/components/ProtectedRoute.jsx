import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // User not logged in - redirect to login
    // replace={true} means login page replaces this entry in browser history
    // so pressing Back doesn't send them to the protected page again
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;