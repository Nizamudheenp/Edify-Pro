import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;
