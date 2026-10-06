import { Navigate, Outlet } from 'react-router-dom';

/** Manages guest routes logic. */
export default function GuestRoutes() {
  const token = localStorage.getItem("user_token");
  
  if (token) {
    return <Navigate to="/feed" replace />;
  }
  
  return <Outlet />;
}
