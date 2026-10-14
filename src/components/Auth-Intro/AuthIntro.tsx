import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import spheraHeroDark from "../../assets/sphera-hero-dark.webm";
import spheraHeroLight from "../../assets/sphera-hero-light.webm";

export default function AuthIntro() {
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (lightVideoRef.current) {
      lightVideoRef.current.defaultMuted = true;
      lightVideoRef.current.muted = true;
      lightVideoRef.current.play().catch(() => {});
    }
    if (darkVideoRef.current) {
      darkVideoRef.current.defaultMuted = true;
      darkVideoRef.current.muted = true;
      darkVideoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full flex items-center justify-center relative overflow-hidden select-none pointer-events-none"
    >
      {/* Light mode hero video */}
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden block dark:hidden">
        <video 
          ref={lightVideoRef}
          src={spheraHeroLight} 
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onEnded={(e) => e.currentTarget.play().catch(() => {})}
          className="w-full h-full object-cover" 
          style={{ transform: "translateZ(0)" }}
        />
      </div>

      {/* Dark mode hero video */}
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden hidden dark:flex">
        <video 
          ref={darkVideoRef}
          src={spheraHeroDark} 
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onEnded={(e) => e.currentTarget.play().catch(() => {})}
          className="w-full h-full object-cover" 
          style={{ transform: "translateZ(0)" }}
        />
      </div>
    </motion.div>
  );
}



