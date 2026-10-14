import { Key, Eye, EyeOff, AtSign, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthTabs from "../../../components/AuthTabs/AuthTabs";
import AuthBrandHeader from "../../../components/AuthBrandHeader/AuthBrandHeader";
import { loginUser } from "../../../services/Auth.service";
import { ErrorMessage } from "../../../components/Alerts/ErrorMessage";
import { SuccessMessage } from "../../../components/Alerts/SuccessMessage";
import { UserDataContext } from "../../../contexts/UserData";



const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, "Password must be at least 8 characters, and include uppercase, lowercase, number, and special character.")
});

type LoginFormValues = z.infer<typeof loginSchema>;
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const {saveUserData } = useContext(UserDataContext);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
    const { register, handleSubmit, watch, reset, formState: { errors, isValid, isSubmitting } } = useForm<LoginFormValues>({
      mode: "onChange",
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: ""
      }
    });
  const passwordValue = watch("password");    const onSubmit = async ({ email, password }: LoginFormValues) => {
    const userData = {
      email: email,
      password: password
    };
    
    setApiError(null);
    setApiSuccess(null);
        const { success, message, token, user } = await loginUser(userData);
    if (success) {
      setApiSuccess(message);
      localStorage.setItem("user_token", token);
      saveUserData(user);
      reset();
      setTimeout(() => navigate("/"), 500);
    }
    else {
      setApiError(message);
      setTimeout(() => setApiError(null), 3000);
    }
  };

  return (
    <>
      <section className="bg-transparent dark:bg-transparent sm:bg-white dark:sm:bg-slate-900 border-0 sm:border border-transparent sm:border-gray-100 dark:sm:border-slate-800 rounded-none sm:rounded-3xl shadow-none sm:shadow-xl p-0 sm:p-8 max-w-[460px] w-full mx-auto">
        {/* Brand header */}
        <AuthBrandHeader />
        
        {/* Auth tabs */}
        <AuthTabs className="mb-4 tall:mb-6 taller:mb-8 sm:mb-6" />

        {/* Form area with smooth fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >

        {/* Desktop title */}
        <div className="hidden sm:block mb-6">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight mb-1">
            Log in to Sphera Social
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
            Log in and continue your social journey.
          </p>
        </div>
          
      <form className="flex flex-col gap-3 tall:gap-4.5 taller:gap-5 sm:gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email input */}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <AtSign className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("email")}
              type="email" 
              autoComplete="email"
              placeholder="Email address" 
              className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-4 text-slate-800 dark:text-white text-base sm:text-[14.5px] outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal shadow-sm ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`}
            />
          </div>
          {errors.email && <span className="text-red-500 text-xs px-2">{errors.email.message}</span>}
        </div>

        {/* Password input */}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Key className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password" 
              className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-11 text-slate-800 dark:text-white text-base sm:text-[14.5px] outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal [&::-ms-reveal]:hidden [&::-ms-clear]:hidden shadow-sm ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`}
            />
            {passwordValue && passwordValue.length > 0 && (
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400 dark:text-slate-300 w-4 h-4 hover:text-gray-600 dark:hover:text-white transition-colors" />
                ) : (
                  <Eye className="text-gray-400 dark:text-slate-300 w-4 h-4 hover:text-gray-600 dark:hover:text-white transition-colors" />
                )}
              </button>
            )}
          </div>
          {errors.password && <span className="text-red-500 text-xs px-2">{errors.password.message}</span>}
        </div>

        {/* Forgot password link */}
        <div className="flex justify-end -mt-0.5 tall:mt-0.5 px-1">
          <Link 
            to="/auth/forgot-password" 
            className="text-xs tall:text-[13px] font-semibold text-[#00298D] dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <ErrorMessage message={apiError} />
        <SuccessMessage message={apiSuccess} />

        {/* Submit button */}
        <button 
          disabled={!isValid || isSubmitting}
          type="submit" 
          className="cursor-pointer mt-1 tall:mt-2.5 taller:mt-3 w-full bg-gradient-to-r from-[#00298D] via-[#0036b3] to-[#00298D] hover:opacity-95 active:scale-[0.98] transition-all duration-200 text-white font-bold py-3.5 tall:py-4 taller:py-4.5 text-[15px] tall:text-base sm:text-base rounded-2xl shadow-lg shadow-[#00298D]/30 hover:shadow-xl hover:shadow-[#00298D]/40 flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Logging In...
            </>
          ) : (
            "Log In"
          )}
        </button>

        {/* Social logins - hidden on small screens */}
        <div className="hidden sm:block">
          {/* Divider */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="border-t border-gray-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-xs text-gray-400 dark:text-slate-500 font-medium absolute">
              or continue with
            </span>
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40 text-gray-400 dark:text-slate-400 text-xs font-semibold opacity-60 cursor-not-allowed select-none transition-all"
              title="Google login coming soon"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-gray-200/70 dark:bg-slate-700/70 px-1.5 py-0.5 rounded">Soon</span>
            </button>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40 text-gray-400 dark:text-slate-400 text-xs font-semibold opacity-60 cursor-not-allowed select-none transition-all"
              title="Facebook login coming soon"
            >
              <svg className="w-4 h-4 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-gray-200/70 dark:bg-slate-700/70 px-1.5 py-0.5 rounded">Soon</span>
            </button>
          </div>
        </div>

        {/* Footer switch prompt on mobile */}
        <div className="text-center mt-2.5 tall:mt-5 taller:mt-7 sm:mt-2 text-xs tall:text-sm sm:text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link 
            to="/auth/register" 
            className="font-bold text-[#00298D] dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition-colors"
          >
            Create account
          </Link>
        </div>
      </form>
        </motion.div>
      </section>
    </>
  );
}
