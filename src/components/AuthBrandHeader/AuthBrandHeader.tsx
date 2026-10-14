import spheraIconLight from "../../assets/sphera-icon-light.svg";

interface AuthBrandHeaderProps {
  className?: string;
}

export default function AuthBrandHeader({ className = "mb-4 tall:mb-6 taller:mb-8" }: AuthBrandHeaderProps) {
  return (
    <div className={`lg:hidden text-center ${className} flex flex-col items-center`}>
      <div className="w-11 h-11 tall:w-14 tall:h-14 taller:w-16 taller:h-16 rounded-2xl tall:rounded-3xl bg-gradient-to-tr from-[#00298D] to-[#0036b3] p-2.5 tall:p-3 taller:p-3.5 shadow-md shadow-[#00298D]/25 flex items-center justify-center mb-2 tall:mb-3 transition-all">
        <img src={spheraIconLight} alt="Sphera Social" className="w-full h-full object-contain" />
      </div>
      <div className="flex items-center gap-1.5 text-2xl tall:text-3xl tracking-tight mb-1 tall:mb-1.5">
        <span className="font-black text-slate-900 dark:text-white">Sphera</span>
        <span className="font-extrabold text-[#00298D] dark:text-blue-400">Social</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs tall:text-sm font-normal">
        Connect with friends and the world around you.
      </p>
    </div>
  );
}
