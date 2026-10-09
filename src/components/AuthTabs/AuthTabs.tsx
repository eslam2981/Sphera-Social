import { NavLink } from "react-router-dom";
export default function AuthTabs() {
  return (
    <div className="bg-[#F4F7FB] dark:bg-slate-800 p-1.5 rounded-2xl flex items-center mb-6 w-full max-w-md mx-auto shadow-sm border border-gray-100 dark:border-slate-700">
      <NavLink 
        to="/auth/login"
        className={({ isActive }) => 
          `flex-1 text-center py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
            isActive 
              ? "bg-white dark:bg-slate-900 text-[#00298D] dark:text-blue-400 shadow-sm" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-slate-700/40"
          }`
        }
      >
        Login
      </NavLink>
      <NavLink 
        to="/auth/register"
        className={({ isActive }) => 
          `flex-1 text-center py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
            isActive 
              ? "bg-white dark:bg-slate-900 text-[#00298D] dark:text-blue-400 shadow-sm" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-slate-700/40"
          }`
        }
      >
        Register
      </NavLink>
    </div>
  );
}
