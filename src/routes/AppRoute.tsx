import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout";
import MainLayouts from "../Layouts/MainLayouts";
import ProtectedRoutes from './ProtectedRoutes';
import GuestRoutes from './GuestRoutes';

// Eager load pages to rely only on component skeletons
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import Newsfeed from "../pages/Newsfeed/Newsfeed";
import Profile from "../pages/Profile/Profile";
import Notification from "../pages/Notification/Notfication";
import NotFound from "../pages/NotFound/NotFound";
import Settings from "../pages/Settings/Settings";
import PostDetails from "../pages/PostDetails/PostDetails";
import UserProfile from "../pages/UserProfile/UserProfile";
import Friends from "../pages/Friends/Friends";

export const routes = createBrowserRouter([
  {
    path: "/auth",
    element: <GuestRoutes />,
    children: [
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />
          },
          {
            path: "register",
            element: <Register />
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />
          },
          {
            index: true,
            element: <Navigate to="/auth/login" replace />
          }
        ]
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
    
  },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <MainLayouts />,
        children: [
          {
            path: "feed",
            element: <Newsfeed />
          },
          {
            path: "my-posts",
            element: <Newsfeed />
          },
          {
            path: "saved",
            element: <Newsfeed />
          },
          {
            index: true,
            element: <Navigate to="feed" replace />
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "settings",
            element: <Settings />
          },
          {
            path: "friends",
            element: <Friends />
          },
          {
            path: "user/:id",
            element: <UserProfile />
          },
          {
            path: "notification",
            element: <Notification />
          },
          {
            path: "post/:id",
            element: <PostDetails />
          }
        ]
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);