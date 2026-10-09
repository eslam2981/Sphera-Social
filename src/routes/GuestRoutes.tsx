import { Navigate, Outlet } from 'react-router-dom';
export default function GuestRoutes() {
  const token = localStorage.getItem("user_token");
  
  if (token) {
    return <Navigate to="/feed" replace />;
  }
  
  return <Outlet />;
}
