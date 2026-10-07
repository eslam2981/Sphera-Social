import { Key, Eye, EyeOff, AtSign, Loader2 } from "lucide-react";
import spheraLogo from "../../../assets/sphera-mark.svg";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthTabs from "../../../components/AuthTabs/AuthTabs";
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

/** Renders the login component. */
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
  /** Renders the {save user data } component. */
    const {saveUserData } = useContext(UserDataContext);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  /** Renders the { register, handle submit, watch, reset, form state: { errors, is valid, is submitting } } component. */
    const { register, handleSubmit, watch, reset, formState: { errors, isValid, isSubmitting } } = useForm<LoginFormValues>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const passwordValue = watch("password");

  /** Manages on submit logic. */
    const onSubmit = async ({ email, password }: LoginFormValues) => {
    const userData = {
      email: email,
      password: password
    };
    
    setApiError(null);
    setApiSuccess(null);
    
    /** Renders the { success, message, token, user } component. */
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
      <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 max-w-lg w-full border border-gray-100 dark:border-slate-800 mx-auto animate-fade-in-up">
        {}
        <div className="lg:hidden text-center mb-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <img src={spheraLogo} alt="Sphera Social Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-indigo-600 text-2xl font-black tracking-tight">Sphera Social</h1>
          </div>
          <p className="text-slate-600 dark:text-gray-400 text-sm font-medium opacity-80">Connect with friends and the world around you.</p>
        </div>
        
        <AuthTabs />

        <h2 className="text-[#001D4A] dark:text-white text-xl md:text-2xl font-black mb-1.5 leading-tight tracking-tight">Log in to Sphera Social</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm font-medium">Log in and continue your social journey.</p>
          
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit(onSubmit)}>
        {}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <AtSign className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("email")}
              type="email" 
              placeholder="Email address" 
              className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-blue-50 dark:focus:bg-slate-700 transition-colors duration-200 rounded-xl p-3 pl-10 text-gray-800 dark:text-white text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium ${errors.email ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
            />
          </div>
          {errors.email && <span className="text-red-500 text-xs px-2">{errors.email.message}</span>}
        </div>

        {}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Key className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-blue-50 dark:focus:bg-slate-700 transition-colors duration-200 rounded-xl p-3 pl-10 pr-10 text-gray-800 dark:text-white text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${errors.password ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
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

        <ErrorMessage message={apiError} />
        <SuccessMessage message={apiSuccess} />

        {}
        <button 
          disabled={!isValid || isSubmitting}
          type="submit" 
          className="cursor-pointer mt-3 w-full bg-[#00298D] hover:bg-[#001D66] active:scale-[0.98] transition-all duration-200 text-white font-bold py-3.5 text-[15px] rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-[#00298D]"
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

        {}
        <div className="text-center mt-3">
          <Link 
            to="/auth/forgot-password" 
            className="text-[#00298D] dark:text-blue-400 text-[15px] font-bold hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>
      </section>
    </>
  );
}
