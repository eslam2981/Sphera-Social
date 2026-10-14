import { AtSign, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthBrandHeader from "../../../components/AuthBrandHeader/AuthBrandHeader";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm<{ email: string }>();
  const onSubmit = (_data: { email: string }) => {
  };

  return (
    <section className="bg-transparent dark:bg-transparent sm:bg-white dark:sm:bg-slate-900 border-0 sm:border border-transparent sm:border-gray-100 dark:sm:border-slate-800 rounded-none sm:rounded-3xl shadow-none sm:shadow-xl p-0 sm:p-8 max-w-[460px] w-full mx-auto">
      {/* Mobile Brand Header */}
      <AuthBrandHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="mb-5 tall:mb-7 taller:mb-8 sm:mb-6 text-center sm:text-left">
        <h2 className="text-slate-900 dark:text-white text-xl tall:text-2xl font-bold tracking-tight mb-1">
          Reset your password
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs tall:text-sm font-normal">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>
          
      <form className="flex flex-col gap-3.5 tall:gap-4.5 taller:gap-5 sm:gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email input */}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <AtSign className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("email")}
              type="email" 
              placeholder="Email address" 
              required
              className="w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-4 text-slate-800 dark:text-white text-base sm:text-[14.5px] outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal shadow-sm"
            />
          </div>
        </div>

        {/* Submit button */}
        <button 
          type="submit" 
          className="cursor-pointer mt-1 tall:mt-2.5 taller:mt-3 w-full bg-gradient-to-r from-[#00298D] via-[#0036b3] to-[#00298D] hover:opacity-95 active:scale-[0.98] transition-all duration-200 text-white font-bold py-3.5 tall:py-4 taller:py-4.5 text-[15px] tall:text-base sm:text-base rounded-2xl shadow-lg shadow-[#00298D]/30 hover:shadow-xl hover:shadow-[#00298D]/40 flex justify-center items-center gap-2"
        >
          Send Reset Link
        </button>

        {/* Back to login */}
        <div className="text-center mt-3 tall:mt-5 taller:mt-7">
          <Link 
            to="/auth/login" 
            className="text-xs tall:text-sm font-bold text-[#00298D] dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </form>
      </motion.div>
    </section>
  );
}
