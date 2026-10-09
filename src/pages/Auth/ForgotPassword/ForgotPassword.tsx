import { AtSign, ArrowLeft } from "lucide-react";
import spheraLogo from "../../../assets/sphera-mark.svg";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
export default function ForgotPassword() {
    const { register, handleSubmit } = useForm<{ email: string }>();
    const onSubmit = (data: { email: string }) => {
    console.log("Forgot Password Request:", data);
  };

  return (
    <section className="bg-transparent sm:bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border-0 sm:border shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 max-w-md w-full w-full border border-gray-100 dark:border-slate-800 mx-auto">
      {}
      <div className="lg:hidden text-center mb-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <img src={spheraLogo} alt="Sphera Social Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-indigo-600 text-2xl font-black tracking-tight">Sphera Social</h1>
        </div>
        <p className="text-slate-600 dark:text-gray-400 text-sm font-medium opacity-80">Connect with friends and the world around you.</p>
      </div>

      <h2 className="text-[#001D4A] dark:text-white text-xl md:text-2xl font-black mb-1.5 leading-tight tracking-tight mt-2">Reset your password</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm font-medium">Enter your email address and we will send you a link to reset your password.</p>
          
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit(onSubmit)}>
        {}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <AtSign className="text-gray-400 group-focus-within:text-[#00298D] w-4 h-4 transition-colors duration-200" />
          </div>
          <input 
            {...register("email")}
            type="email" 
            placeholder="Email address" 
            required
            className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-blue-50 dark:focus:bg-slate-700 transition-colors duration-200 rounded-xl p-3 pl-10 text-gray-800 dark:text-white text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium"
          />
        </div>

        {}
        <button 
          type="submit" 
          className="mt-3 w-full bg-[#00298D] hover:bg-[#001D66] active:scale-[0.98] transition-all duration-200 text-white font-bold py-3.5 text-[15px] rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 cursor-pointer"
        >
          Send Reset Link
        </button>

        {}
        <div className="text-center mt-3">
          <Link 
            to="/auth/login" 
            className="text-[#00298D] dark:text-blue-400 text-[15px] font-bold hover:underline flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </form>
    </section>
  );
}
