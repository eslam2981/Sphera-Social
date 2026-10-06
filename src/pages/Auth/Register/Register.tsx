import { User, AtSign, Calendar, Key,  Eye, EyeOff, Loader2 } from "lucide-react";
import spheraLogo from "../../../assets/sphera-mark.svg";
import { useForm} from "react-hook-form";
import { useState } from "react";
import AuthTabs from "../../../components/AuthTabs/AuthTabs";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import{ createNewUser } from "../../../services/Auth.service";
import { ErrorMessage } from "../../../components/Alerts/ErrorMessage";
import { SuccessMessage } from "../../../components/Alerts/SuccessMessage";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  name: z.string().nonempty("Full name is required").min(3,"Full name must be at least 3 characters" ).max(20,"Full name must be at most 20 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20,"Username must be at most 3 characters").optional().or(z.literal('')), 
  email: z.string().email({ message: "Invalid email address" }),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((date) => {
    return new Date().getFullYear() - new Date(date).getFullYear() >=18;
  }, { message: "user age must be at least 18 years old" }),
  password: z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, "Password must be at least 8 characters, and include uppercase, lowercase, number, and special character."),
  rePassword: z.string().nonempty("Please confirm your password."),
  gender: z.enum(["male", "female"], {
    message: "Please select your gender"
  }),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/** Renders the register component. */
export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  /** Renders the { register, handle submit, watch, form state: { errors, is valid, is submitting }, reset } component. */
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting }, reset } = useForm<RegisterFormValues>({ 
    mode: "onChange", 
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      gender: undefined, 
      dateOfBirth: "",
      password: "",
      rePassword: ""
    }
  });


    /** Manages on submit logic. */
    const onSubmit = async({name, username, email, gender, dateOfBirth, password, rePassword}: RegisterFormValues) => {
    const userData = {
      name: name,
      username: username || undefined,
      email: email,
      gender: gender,
      dateOfBirth: dateOfBirth,
      password: password,
      rePassword: rePassword
    }
    
    setApiError(null);
    setApiSuccess(null);
    
    /** Renders the {success,message} component. */
        const {success,message} = await createNewUser(userData);

    if (success) {
      setApiSuccess(message);
      reset();
      setTimeout(() => navigate("/auth/login"), 500);
    } else {
      setApiError(message);
      setTimeout(() => setApiError(null), 3000);
    }
  }

  
  const passwordValue = watch("password");
  const rePasswordValue = watch("rePassword");


  return (
    <>
      <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-5 md:p-6 max-w-lg w-full border border-gray-100 dark:border-slate-800 mx-auto animate-fade-in-up">
      {}
      <div className="lg:hidden text-center mb-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <img src={spheraLogo} alt="Sphera Social Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-indigo-600 text-2xl font-black tracking-tight">Sphera Social</h1>
        </div>
        <p className="text-slate-600 dark:text-gray-400 text-sm font-medium opacity-80">Connect with friends and the world around you.</p>
      </div>
      
      <AuthTabs />

      <h2 className="text-[#001D4A] dark:text-white text-xl md:text-2xl font-black mb-1.5 leading-tight tracking-tight">Create a new account</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm font-medium">It is quick and easy.</p>
          
      <form className="flex flex-col gap-2.5" onSubmit={handleSubmit(onSubmit)}>
        {}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("name")}
              type="text" 
              placeholder="Full name" 
              className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-blue-50 dark:focus:bg-slate-700 transition-colors duration-200 rounded-xl p-3 pl-10 text-gray-800 dark:text-white text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium ${errors.name ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
            />
          </div>
          {errors.name && <span className="text-red-500 text-xs px-2">{errors.name.message}</span>}
        </div>

        {}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <AtSign className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("username")}
              type="text" 
              placeholder="Username (optional)" 
              className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-blue-50 dark:focus:bg-slate-700 transition-colors duration-200 rounded-xl p-3 pl-10 text-gray-800 dark:text-white text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium ${errors.username ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
            />
          </div>
          {errors.username && <span className="text-red-500 text-xs px-2">{errors.username.message}</span>}
        </div>

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
          <div className="flex items-center gap-3">
            <label className="flex-1 relative">
              <input type="radio" value="male" {...register("gender")} className="peer sr-only" />
              <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 cursor-pointer transition-colors duration-200 rounded-xl p-3 text-gray-800 dark:text-white text-sm font-medium border border-transparent peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 peer-checked:border-[#00298D] dark:peer-checked:border-blue-500 peer-checked:text-[#00298D] dark:peer-checked:text-blue-400 [&_.radio-dot]:opacity-0 peer-checked:[&_.radio-dot]:opacity-100">
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  <div className="radio-dot w-2 h-2 rounded-full bg-current transition-opacity duration-200"></div>
                </div>
                Male
              </div>
            </label>
            <label className="flex-1 relative">
              <input type="radio" value="female" {...register("gender")} className="peer sr-only" />
              <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 cursor-pointer transition-colors duration-200 rounded-xl p-3 text-gray-800 dark:text-white text-sm font-medium border border-transparent peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 peer-checked:border-[#00298D] dark:peer-checked:border-blue-500 peer-checked:text-[#00298D] dark:peer-checked:text-blue-400 [&_.radio-dot]:opacity-0 peer-checked:[&_.radio-dot]:opacity-100">
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  <div className="radio-dot w-2 h-2 rounded-full bg-current transition-opacity duration-200"></div>
                </div>
                Female
              </div>
            </label>
          </div>
          {errors.gender && <span className="text-red-500 text-xs px-2">{errors.gender.message}</span>}
        </div>

        {}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Calendar className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("dateOfBirth")}
              type="date" 
              placeholder="mm/dd/yyyy" 
              className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-blue-50 dark:focus:bg-slate-700 transition-colors duration-200 rounded-xl p-3 pl-10 text-gray-800 dark:text-white text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium ${errors.dateOfBirth ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
            />
          </div>
          {errors.dateOfBirth && <span className="text-red-500 text-xs px-2">{errors.dateOfBirth.message}</span>}
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

        {}
        <div className="flex flex-col gap-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Key className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
            </div>
            <input 
              {...register("rePassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password" 
              className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-blue-50 dark:focus:bg-slate-700 transition-colors duration-200 rounded-xl p-3 pl-10 pr-10 text-gray-800 dark:text-white text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-medium [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${errors.rePassword ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
            />
            {rePasswordValue && rePasswordValue.length > 0 && (
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="text-gray-400 dark:text-slate-300 w-4 h-4 hover:text-gray-600 dark:hover:text-white transition-colors" />
                ) : (
                  <Eye className="text-gray-400 dark:text-slate-300 w-4 h-4 hover:text-gray-600 dark:hover:text-white transition-colors" />
                )}
              </button>
            )}
          </div>
          {errors.rePassword && <span className="text-red-500 text-xs px-2">{errors.rePassword.message}</span>}
        </div>
        
        <ErrorMessage message={apiError} />
        <SuccessMessage message={apiSuccess} />

        <button 
          disabled={!isValid || isSubmitting}
          type="submit" 
          className="cursor-pointer mt-3 w-full bg-[#00298D] hover:bg-[#001D66] active:scale-[0.98] transition-all duration-200 text-white font-bold py-3.5 text-[15px] rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-[#00298D]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create New Account"
          )}
        </button>
      </form>
    </section>
    </>
  )
}
