import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import MainLayouts from "../Layouts/MainLayouts";
import ProtectedRoutes from './ProtectedRoutes';
import GuestRoutes from './GuestRoutes';

// Lazy load pages for better performance
const Login = lazy(() => import("../pages/Auth/Login/Login"));
const Register = lazy(() => import("../pages/Auth/Register/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword/ForgotPassword"));
const Newsfeed = lazy(() => import("../pages/Newsfeed/Newsfeed"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Notification = lazy(() => import("../pages/Notification/Notfication"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const PostDetails = lazy(() => import("../pages/PostDetails/PostDetails"));
const UserProfile = lazy(() => import("../pages/UserProfile/UserProfile"));
const Friends = lazy(() => import("../pages/Friends/Friends"));

// Loading fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#F0F2F5] dark:bg-slate-950">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
            element: <Suspense fallback={<PageLoader />}><Login /></Suspense>
          },
          {
            path: "register",
            element: <Suspense fallback={<PageLoader />}><Register /></Suspense>
          },
          {
            path: "forgot-password",
            element: <Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>
          },
          {
            index: true,
            element: <Navigate to="/auth/login" replace />
          }
        ]
      },
      {
        path: "*",
        element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
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
            element: <Suspense fallback={<PageLoader />}><Newsfeed /></Suspense>
          },
          {
            path: "my-posts",
            element: <Suspense fallback={<PageLoader />}><Newsfeed /></Suspense>
          },
          {
            path: "saved",
            element: <Suspense fallback={<PageLoader />}><Newsfeed /></Suspense>
          },
          {
            index: true,
            element: <Navigate to="feed" replace />
          },
          {
            path: "profile",
            element: <Suspense fallback={<PageLoader />}><Profile /></Suspense>
          },
          {
            path: "settings",
            element: <Suspense fallback={<PageLoader />}><Settings /></Suspense>
          },
          {
            path: "friends",
            element: <Suspense fallback={<PageLoader />}><Friends /></Suspense>
          },
          {
            path: "user/:id",
            element: <Suspense fallback={<PageLoader />}><UserProfile /></Suspense>
          },
          {
            path: "notification",
            element: <Suspense fallback={<PageLoader />}><Notification /></Suspense>
          },
          {
            path: "post/:id",
            element: <Suspense fallback={<PageLoader />}><PostDetails /></Suspense>
          }
        ]
      },
      {
        path: "*",
        element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense>
      }
    ]
  }
]);