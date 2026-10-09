import { Users, MessageSquare, Globe, Heart, Shield } from "lucide-react";
import spheraLogo from "../../assets/sphera-mark.svg";
export default function AuthIntro() {
  const stats = [
    { icon: Users, value: "1M+", label: "ACTIVE USERS" },
    { icon: MessageSquare, value: "50M+", label: "DAILY POSTS" },
    { icon: Globe, value: "150+", label: "COUNTRIES" },
    { icon: Heart, value: "5M+", label: "CONNECTIONS" },
    { icon: Shield, value: "100%", label: "SECURE" },
  ];

  return (
    <section className="w-full max-w-2xl mx-auto lg:mx-0">
      <div className="hidden lg:block mb-5">
        <div className="flex items-center gap-3 mb-2">
            <img src={spheraLogo} alt="Sphera Social Logo" className="w-12 h-12 object-contain drop-shadow-md" />
            <h1 className="text-6xl font-black text-indigo-600 pb-1 tracking-tight">
              Sphera Social
            </h1>
        </div>
        <p className="text-slate-700 dark:text-gray-300 text-2xl font-medium mt-2 leading-snug">
            Connect with friends and the world around you on Sphera Social.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-slate-800 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,41,141,0.08)]">
        {}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00298D] via-[#42A5F5] to-[#00298D] opacity-90" />
        
        <div className="flex items-center gap-3 mb-3 mt-1">
          <div className="h-5 w-1.5 rounded-full bg-[#00298D]" />
          <span className="text-[#00298D] text-sm font-black tracking-[0.2em] uppercase">About Our Community</span>
        </div>
        
        <h2 className="text-[#001D4A] dark:text-white font-extrabold text-xl mb-3 leading-tight tracking-tight">Your Space to Share, Connect, and Grow</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">
            Sphera Social is the ultimate platform for building meaningful connections. Share your thoughts, discover new interests, and engage with a global community. We prioritize your privacy and experience, providing a safe and vibrant environment for everyone to express themselves freely.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl p-3 transition-all duration-300 group/stat flex flex-col items-center justify-center text-center ${idx === 4 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-2 group-hover/stat:-translate-y-1 group-hover/stat:shadow-md group-hover/stat:text-[#00298D] dark:group-hover/stat:text-blue-400 group-hover/stat:border-blue-200 dark:group-hover/stat:border-blue-900 transition-all duration-300">
                <stat.icon className="w-4 h-4 text-gray-400 group-hover/stat:text-[#00298D] dark:group-hover/stat:text-blue-400 transition-colors duration-300" strokeWidth={2.5} />
              </div>
              <h3 className="text-[#001D4A] dark:text-white font-black text-lg mb-0.5">{stat.value}</h3>
              <p className="text-[#4A5568] dark:text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
