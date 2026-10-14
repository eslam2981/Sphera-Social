import { User, AtSign, Calendar, Key, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import spheraIconLight from "../../../assets/sphera-icon-light.svg";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import AuthTabs from "../../../components/AuthTabs/AuthTabs";
import AuthBrandHeader from "../../../components/AuthBrandHeader/AuthBrandHeader";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewUser } from "../../../services/Auth.service";
import { ErrorMessage } from "../../../components/Alerts/ErrorMessage";
import { SuccessMessage } from "../../../components/Alerts/SuccessMessage";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const registerSchema = z.object({
  name: z.string().nonempty("Full name is required").min(3, "Full name must be at least 3 characters").max(20, "Full name must be at most 20 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").optional().or(z.literal('')), 
  email: z.string().email({ message: "Invalid email address" }),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((date) => {
    return new Date().getFullYear() - new Date(date).getFullYear() >= 18;
  }, { message: "User age must be at least 18 years old" }),
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

const STEPS = [
  { id: 1, title: "What's your name?", subtitle: "Enter your real name and optional username." },
  { id: 2, title: "Birthday & Gender", subtitle: "Select your date of birth and gender." },
  { id: 3, title: "What's your email?", subtitle: "Enter the email you'll use to log in." },
  { id: 4, title: "Create a password", subtitle: "Choose a secure password of 8+ characters." },
];

export default function Register() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? !window.matchMedia("(min-width: 1024px)").matches : false
  );
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const listener = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const { register, handleSubmit, watch, trigger, formState: { errors, isValid, isSubmitting }, reset } = useForm<RegisterFormValues>({ 
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

  const passwordValue = watch("password");
  const rePasswordValue = watch("rePassword");
  const genderValue = watch("gender");

  const goToStep = async (targetStep: number) => {
    if (targetStep === step || targetStep < 1 || targetStep > 4) return;
    if (targetStep < step) {
      setDirection(-1);
      setStep(targetStep);
      return;
    }

    let canProceed = true;
    for (let s = step; s < targetStep; s++) {
      let isValidStep = false;
      if (s === 1) {
        isValidStep = await trigger(["name", "username"]);
      } else if (s === 2) {
        isValidStep = await trigger(["dateOfBirth", "gender"]);
      } else if (s === 3) {
        isValidStep = await trigger(["email"]);
      }
      if (!isValidStep) {
        canProceed = false;
        setDirection(s > step ? 1 : -1);
        setStep(s);
        break;
      }
    }

    if (canProceed) {
      setDirection(1);
      setStep(targetStep);
    }
  };

  const nextStep = () => {
    goToStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isMobile && step < 4) {
        e.preventDefault();
        nextStep();
      }
    }
  };

  const onSubmit = async ({ name, username, email, gender, dateOfBirth, password, rePassword }: RegisterFormValues) => {
    const userData = {
      name,
      username: username || undefined,
      email,
      gender,
      dateOfBirth,
      password,
      rePassword
    };
    
    setApiError(null);
    setApiSuccess(null);
    const { success, message } = await createNewUser(userData);

    if (success) {
      setApiSuccess(message);
      reset();
      setTimeout(() => navigate("/auth/login"), 500);
    } else {
      setApiError(message);
      setTimeout(() => setApiError(null), 3000);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  return (
    <section className="bg-transparent dark:bg-transparent sm:bg-white dark:sm:bg-slate-900 border-0 sm:border border-transparent sm:border-gray-100 dark:sm:border-slate-800 rounded-none sm:rounded-3xl shadow-none sm:shadow-xl p-0 sm:p-8 max-w-[460px] w-full mx-auto">
      {/* Mobile view */}
      {isMobile ? (
        <div>
          {/* Brand header */}
          {step === 1 ? (
            <>
              <AuthBrandHeader />
              <AuthTabs className="mb-4 tall:mb-6 taller:mb-8 sm:mb-6" />
            </>
          ) : (
            /* Navigation header */
            <div className="flex items-center justify-between mb-3 tall:mb-5 pt-0.5">
              <button
                type="button"
                onClick={prevStep}
                className="p-1.5 -ml-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00298D] to-[#0036b3] p-1 flex items-center justify-center shadow-sm">
                  <img src={spheraIconLight} alt="Sphera" className="w-full h-full object-contain" />
                </div>
                <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight">Sphera</span>
              </div>
              <Link
                to="/auth/login"
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#00298D] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/50 dark:border-blue-900/40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Log In
              </Link>
            </div>
          )}

          {/* Inputs & form area with smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Progress bar */}
            <div className="mb-3 tall:mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs tall:text-sm font-bold uppercase tracking-wider text-[#00298D] dark:text-blue-400">
                Step {step} of 4
              </span>
              <span className="text-xs tall:text-sm text-slate-400 font-semibold">
                {Math.round((step / 4) * 100)}%
              </span>
            </div>

            {/* Progress pills */}
            <div className="grid grid-cols-4 gap-2 w-full py-1">
              {[1, 2, 3, 4].map((s) => {
                const isCurrent = s === step;
                const isCompleted = s < step;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => goToStep(s)}
                    title={`Step ${s}: ${STEPS[s - 1].title}`}
                    aria-label={`Step ${s}: ${STEPS[s - 1].title}`}
                    className="group py-2 -my-2 flex items-center w-full cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`h-2 tall:h-2.5 w-full rounded-full transition-all duration-300 relative overflow-hidden ${
                        isCurrent
                          ? "bg-gradient-to-r from-[#00298D] to-[#0036b3] ring-2 ring-[#00298D]/25 dark:ring-blue-400/30 shadow-sm"
                          : isCompleted
                          ? "bg-gradient-to-r from-[#00298D]/90 to-[#0036b3]/90 group-hover:opacity-90"
                          : "bg-slate-200/80 dark:bg-slate-800/80 group-hover:bg-slate-300 dark:group-hover:bg-slate-700"
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step title */}
            <div className="mt-2.5 tall:mt-3">
              <h2 className="text-slate-900 dark:text-white text-xl tall:text-2xl font-bold leading-tight">
                {STEPS[step - 1].title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs tall:text-sm mt-0.5 leading-relaxed">
                {STEPS[step - 1].subtitle}
              </p>
            </div>
          </div>
              
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="flex flex-col">
            <div className="flex flex-col justify-start">
              <AnimatePresence mode="wait" custom={direction}>
                {/* STEP 1: Name & Username */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col gap-3 tall:gap-4.5 taller:gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                        </div>
                        <input 
                          {...register("name")}
                          type="text" 
                          autoComplete="name"
                          autoFocus
                          placeholder="Full name (e.g. John Doe)" 
                          className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-4 text-slate-800 dark:text-white text-base outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal shadow-sm ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.name && <span className="text-red-500 text-xs px-1">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <AtSign className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                        </div>
                        <input 
                          {...register("username")}
                          type="text" 
                          autoComplete="username"
                          placeholder="Username (optional)" 
                          className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-4 text-slate-800 dark:text-white text-base outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal shadow-sm ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.username && <span className="text-red-500 text-xs px-1">{errors.username.message}</span>}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Birthday & Gender */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col gap-3 tall:gap-4.5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-xs tall:text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">
                        Date of Birth
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Calendar className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                        </div>
                        <input 
                          {...register("dateOfBirth")}
                          type="date" 
                          autoFocus
                          className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-4 text-slate-800 dark:text-white text-base outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal shadow-sm ${errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.dateOfBirth && <span className="text-red-500 text-xs px-1">{errors.dateOfBirth.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs tall:text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">
                        Gender
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 relative cursor-pointer">
                          <input type="radio" value="male" {...register("gender")} className="peer sr-only" />
                          <div className={`flex items-center justify-center gap-2 rounded-2xl py-3 tall:py-3.5 px-3 text-base font-medium transition-all duration-200 border ${genderValue === "male" ? "bg-blue-50/70 dark:bg-blue-950/40 border-[#00298D] dark:border-blue-500 text-[#00298D] dark:text-blue-400 shadow-sm ring-2 ring-[#00298D]/20" : "bg-white/80 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-white hover:border-slate-300 dark:hover:border-slate-700"}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${genderValue === "male" ? "border-[#00298D] dark:border-blue-400" : "border-slate-400"}`}>
                              {genderValue === "male" && <div className="w-2 h-2 rounded-full bg-[#00298D] dark:bg-blue-400" />}
                            </div>
                            <span>Male</span>
                          </div>
                        </label>

                        <label className="flex-1 relative cursor-pointer">
                          <input type="radio" value="female" {...register("gender")} className="peer sr-only" />
                          <div className={`flex items-center justify-center gap-2 rounded-2xl py-3 tall:py-3.5 px-3 text-base font-medium transition-all duration-200 border ${genderValue === "female" ? "bg-blue-50/70 dark:bg-blue-950/40 border-[#00298D] dark:border-blue-500 text-[#00298D] dark:text-blue-400 shadow-sm ring-2 ring-[#00298D]/20" : "bg-white/80 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-white hover:border-slate-300 dark:hover:border-slate-700"}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${genderValue === "female" ? "border-[#00298D] dark:border-blue-400" : "border-slate-400"}`}>
                              {genderValue === "female" && <div className="w-2 h-2 rounded-full bg-[#00298D] dark:bg-blue-400" />}
                            </div>
                            <span>Female</span>
                          </div>
                        </label>
                      </div>
                      {errors.gender && <span className="text-red-500 text-xs px-1">{errors.gender.message}</span>}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Email */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col gap-3 tall:gap-4.5"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <AtSign className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                        </div>
                        <input 
                          {...register("email")}
                          type="email" 
                          autoComplete="email"
                          autoFocus
                          placeholder="name@example.com" 
                          className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-4 text-slate-800 dark:text-white text-base outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal shadow-sm ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.email && <span className="text-red-500 text-xs px-2">{errors.email.message}</span>}
                      <p className="text-[12px] tall:text-xs text-slate-500 dark:text-slate-400 px-1 mt-0.5 tall:mt-1">
                        We will send confirmation details and updates to this email.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Password & Confirm Password */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex flex-col gap-3 tall:gap-4.5"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Key className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                        </div>
                        <input 
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          autoFocus
                          placeholder="Password" 
                          className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-10 text-slate-800 dark:text-white text-base outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal [&::-ms-reveal]:hidden [&::-ms-clear]:hidden shadow-sm ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
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

                    <div className="flex flex-col gap-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Key className="text-gray-400 dark:text-slate-400 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                        </div>
                        <input 
                          {...register("rePassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Confirm password" 
                          className={`w-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#00298D]/10 dark:focus:ring-blue-500/20 transition-all duration-200 rounded-2xl py-3.5 tall:py-4 taller:py-4.5 pl-11 pr-10 text-slate-800 dark:text-white text-base outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 font-normal [&::-ms-reveal]:hidden [&::-ms-clear]:hidden shadow-sm ${errors.rePassword ? 'border-red-500 focus:border-red-500' : ''}`}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <ErrorMessage message={apiError} />
            <SuccessMessage message={apiSuccess} />

            {/* Mobile Action Buttons */}
            <div className="mt-3.5 tall:mt-6 taller:mt-8 flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3.5 tall:py-4 px-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold text-sm tall:text-base hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              {step < 4 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex-[2] bg-gradient-to-r from-[#00298D] via-[#0036b3] to-[#00298D] hover:opacity-95 active:scale-[0.98] transition-all duration-200 text-white font-bold py-3.5 tall:py-4 taller:py-4.5 text-sm tall:text-base rounded-2xl shadow-lg shadow-[#00298D]/30 flex justify-center items-center gap-2 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="flex-[2] bg-gradient-to-r from-[#00298D] via-[#0036b3] to-[#00298D] hover:opacity-95 active:scale-[0.98] transition-all duration-200 text-white font-bold py-3.5 tall:py-4 taller:py-4.5 text-sm tall:text-base rounded-2xl shadow-lg shadow-[#00298D]/30 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Footer Prompt */}
            <div className="text-center mt-3 tall:mt-5 taller:mt-7 text-xs tall:text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link 
                to="/auth/login" 
                className="font-bold text-[#00298D] dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                Log In
              </Link>
            </div>
          </form>
          </motion.div>
        </div>
      ) : (
        <div>
          {/* Desktop view */}
          <AuthTabs className="mb-6" />

          <h2 className="text-slate-900 dark:text-white text-2xl sm:text-[26px] font-bold mb-1.5 leading-snug">
            Create a new account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm font-normal leading-relaxed">
            It is quick and easy.
          </p>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {/* Full name input */}
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                  </div>
                  <input 
                    {...register("name")}
                    type="text" 
                    autoComplete="name"
                    placeholder="Full name" 
                    className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#00298D]/15 dark:focus:ring-blue-500/20 transition-colors duration-200 rounded-xl py-3 pl-10 pr-3 text-gray-800 dark:text-white text-[14px] outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-normal ${errors.name ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
                  />
                </div>
                {errors.name && <span className="text-red-500 text-xs px-1">{errors.name.message}</span>}
              </div>

              {/* Username input */}
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AtSign className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                  </div>
                  <input 
                    {...register("username")}
                    type="text" 
                    autoComplete="username"
                    placeholder="Username (opt)" 
                    className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#00298D]/15 dark:focus:ring-blue-500/20 transition-colors duration-200 rounded-xl py-3 pl-10 pr-3 text-gray-800 dark:text-white text-[14px] outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-normal ${errors.username ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
                  />
                </div>
                {errors.username && <span className="text-red-500 text-xs px-1">{errors.username.message}</span>}
              </div>
            </div>

            {/* Email input */}
            <div className="flex flex-col gap-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <AtSign className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                </div>
                <input 
                  {...register("email")}
                  type="email" 
                  autoComplete="email"
                  placeholder="Email address" 
                  className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#00298D]/15 dark:focus:ring-blue-500/20 transition-colors duration-200 rounded-xl py-3 pl-10.5 pr-4 text-gray-800 dark:text-white text-[14.5px] outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-normal ${errors.email ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
                />
              </div>
              {errors.email && <span className="text-red-500 text-xs px-2">{errors.email.message}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 items-start">
              {/* Gender selection */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="flex-1 relative cursor-pointer">
                    <input type="radio" value="male" {...register("gender")} className="peer sr-only" />
                    <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 transition-colors duration-200 rounded-xl py-3 px-2 text-gray-800 dark:text-white text-[13.5px] font-normal border border-transparent peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:border-[#00298D] dark:peer-checked:border-blue-500 peer-checked:text-[#00298D] dark:peer-checked:text-blue-400 [&_.radio-dot]:opacity-0 peer-checked:[&_.radio-dot]:opacity-100">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center shrink-0">
                        <div className="radio-dot w-1.5 h-1.5 rounded-full bg-current transition-opacity duration-200"></div>
                      </div>
                      <span>Male</span>
                    </div>
                  </label>
                  <label className="flex-1 relative cursor-pointer">
                    <input type="radio" value="female" {...register("gender")} className="peer sr-only" />
                    <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 transition-colors duration-200 rounded-xl py-3 px-2 text-gray-800 dark:text-white text-[13.5px] font-normal border border-transparent peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:border-[#00298D] dark:peer-checked:border-blue-500 peer-checked:text-[#00298D] dark:peer-checked:text-blue-400 [&_.radio-dot]:opacity-0 peer-checked:[&_.radio-dot]:opacity-100">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center shrink-0">
                        <div className="radio-dot w-1.5 h-1.5 rounded-full bg-current transition-opacity duration-200"></div>
                      </div>
                      <span>Female</span>
                    </div>
                  </label>
                </div>
                {errors.gender && <span className="text-red-500 text-xs px-1">{errors.gender.message}</span>}
              </div>

              {/* Date of birth input */}
              <div className="flex flex-col gap-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                  </div>
                  <input 
                    {...register("dateOfBirth")}
                    type="date" 
                    placeholder="mm/dd/yyyy" 
                    className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#00298D]/15 dark:focus:ring-blue-500/20 transition-colors duration-200 rounded-xl py-3 pl-10 pr-2.5 text-gray-800 dark:text-white text-[13.5px] outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-normal ${errors.dateOfBirth ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
                  />
                </div>
                {errors.dateOfBirth && <span className="text-red-500 text-xs px-1">{errors.dateOfBirth.message}</span>}
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                </div>
                <input 
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Password" 
                  className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#00298D]/15 dark:focus:ring-blue-500/20 transition-colors duration-200 rounded-xl py-3 pl-10.5 pr-10 text-gray-800 dark:text-white text-[14.5px] outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-normal [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${errors.password ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
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

            {/* Confirm password input */}
            <div className="flex flex-col gap-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="text-gray-400 dark:text-slate-300 group-focus-within:text-[#00298D] dark:group-focus-within:text-blue-400 w-4 h-4 transition-colors duration-200" />
                </div>
                <input 
                  {...register("rePassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm password" 
                  className={`w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00298D] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#00298D]/15 dark:focus:ring-blue-500/20 transition-colors duration-200 rounded-xl py-3 pl-10.5 pr-10 text-gray-800 dark:text-white text-[14.5px] outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 font-normal [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${errors.rePassword ? 'border border-red-500 focus:border-red-500' : 'border border-transparent'}`}
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
              className="cursor-pointer mt-2.5 w-full bg-[#00298D] hover:bg-[#001D66] active:scale-[0.98] transition-all duration-200 text-white font-semibold py-3.5 text-base rounded-xl shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-[#00298D]"
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
        </div>
      )}
    </section>
  );
}
