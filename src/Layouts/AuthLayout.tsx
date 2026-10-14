import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import AuthIntro from "../components/Auth-Intro/AuthIntro";

export default function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes("register");
  const [isDesktop, setIsDesktop] = useState(() => 
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <LayoutGroup id="authTabGroup">
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="bg-[#F0F2F5] dark:bg-slate-950 h-[100dvh] max-h-[100dvh] w-full relative overflow-hidden selection:bg-[#00298D] selection:text-white"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[650px] h-[220px] sm:h-[400px] bg-gradient-to-b from-[#00298D]/25 via-indigo-600/10 to-transparent blur-[85px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 right-0 w-[240px] h-[240px] bg-blue-500/10 blur-[90px] pointer-events-none -z-0 hidden dark:block" />

        {/* Mobile view */}
        {!isDesktop && (
          <div className="w-full h-[100dvh] flex items-center justify-center p-4 sm:p-6 tall:py-8 taller:py-12 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-10">
            <div className="w-full max-w-[420px] tall:max-w-[440px] mx-auto my-auto flex flex-col justify-center">
              <Outlet />
            </div>
          </div>
        )}

        {/* Desktop view */}
        {isDesktop && (
        <div className="w-full h-full relative overflow-hidden">
          {/* Hero banner */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1/2 h-full z-20 overflow-hidden border-indigo-200/60 dark:border-indigo-900/40 bg-gradient-to-br from-[#F6F6FF] via-[#EFEEFF] to-[#E8E6FE] dark:from-[#0E1943] dark:via-[#1A1955] dark:to-[#271A67] isolate will-change-transform"
            initial={false}
            animate={{
              x: isRegister ? "100%" : "0%",
              borderTopLeftRadius: isRegister ? "2.5rem" : "0rem",
              borderBottomLeftRadius: isRegister ? "2.5rem" : "0rem",
              borderTopRightRadius: isRegister ? "0rem" : "2.5rem",
              borderBottomRightRadius: isRegister ? "0rem" : "2.5rem",
              borderLeftWidth: isRegister ? 1 : 0,
              borderRightWidth: isRegister ? 0 : 1,
              boxShadow: isRegister 
                ? "-16px 0 36px -8px rgba(0, 0, 0, 0.2)" 
                : "16px 0 36px -8px rgba(0, 0, 0, 0.2)",
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <AuthIntro />
          </motion.div>

          {/* Form container */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1/2 h-full z-10 flex items-center justify-center p-4 xl:p-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden isolate will-change-transform"
            initial={false}
            animate={{
              x: isRegister ? "0%" : "100%",
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="w-full max-w-md mx-auto my-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
      </motion.main>
    </LayoutGroup>
  );
}




