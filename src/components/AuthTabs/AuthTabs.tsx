import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthTabs({ className = "mb-4 sm:mb-6" }: { className?: string }) {
  const location = useLocation();
  const isRegister = location.pathname.includes("register");

  return (
    <div className={`relative bg-slate-200/80 dark:bg-slate-900/90 p-1.5 rounded-2xl flex items-center ${className} w-full max-w-md mx-auto border border-slate-300/50 dark:border-slate-800/80 shadow-inner backdrop-blur-md`}>
      <NavLink 
        to="/auth/login"
        className={`relative z-10 flex-1 text-center py-2.5 tall:py-3 rounded-xl text-[14px] tall:text-[15px] font-bold transition-colors duration-200 ${
          !isRegister 
            ? "text-white font-extrabold" 
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        }`}
      >
        {!isRegister && (
          <motion.div
            layoutId="activeAuthTabPill"
            className="absolute inset-0 bg-gradient-to-r from-[#00298D] via-[#0036b3] to-[#00298D] rounded-xl shadow-md shadow-[#00298D]/25 border border-white/10"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span className="relative z-10">Login</span>
      </NavLink>

      <NavLink 
        to="/auth/register"
        className={`relative z-10 flex-1 text-center py-2.5 tall:py-3 rounded-xl text-[14px] tall:text-[15px] font-bold transition-colors duration-200 ${
          isRegister 
            ? "text-white font-extrabold" 
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        }`}
      >
        {isRegister && (
          <motion.div
            layoutId="activeAuthTabPill"
            className="absolute inset-0 bg-gradient-to-r from-[#00298D] via-[#0036b3] to-[#00298D] rounded-xl shadow-md shadow-[#00298D]/25 border border-white/10"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <span className="relative z-10">Register</span>
      </NavLink>
    </div>
  );
}
