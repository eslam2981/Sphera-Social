import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoutes() {
  const token = localStorage.getItem("user_token");
  
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <Outlet />;
}
  