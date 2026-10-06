import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../../contexts/UserData.js";
import { ThemeContext } from "../../contexts/ThemeContext.tsx";
import { User, Lock, Palette, Moon, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "../../services/Auth.service";
import { ErrorMessage } from "../../components/Alerts/ErrorMessage";
import { SuccessMessage } from "../../components/Alerts/SuccessMessage";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, "Password must be at least 8 characters, and include uppercase, lowercase, number, and special character.")
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

/** Renders the settings component. */
export default function Settings() {
  /** Renders the {  data } component. */
    const { Data } = useContext(UserDataContext);
  /** Renders the { is dark mode, toggle dark mode } component. */
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  /** Renders the { name, email } component. */
    const { name, email } = Data || { name: "User", email: "user@example.com" };
    const [activeTab, setActiveTab] = useState("account");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  /** Renders the { register, handle submit, reset, watch, form state: { errors, is valid, is submitting } } component. */
    const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting } } = useForm<PasswordFormValues>({
    mode: "onChange",
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: ""
    }
  });

  const currentPasswordValue = watch("currentPassword");
  const newPasswordValue = watch("newPassword");

  /** Manages on submit logic. */
    const onSubmit = async (data: PasswordFormValues) => {
    const userData = {
        password: data.currentPassword,
      newPassword: data.newPassword
    }
    
    setApiError(null);
    setApiSuccess(null);
    
    /** Renders the { success, message} component. */
        const { success, message} = await changePassword(userData);

    if (success) {
      setApiSuccess("Password changed successfully! Please log in again.");
      localStorage.removeItem("user_token");
      reset();
      setTimeout(() => navigate("/auth/login"), 2000);
    } else {
      setApiError(message || "Failed to change password");
      setTimeout(() => setApiError(null), 3000);
    }
  };

  const tabs = [
    { id: "account", label: "Account Settings", icon: User },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="w-full mx-auto px-4 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        
        {}
        <div className="w-full md:w-64 shrink-0">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6 px-2">Settings</h1>
          <div className="flex flex-col gap-2 pb-6 md:pb-0 px-2 md:px-0">
            {tabs.map((tab) => {
              /** Renders the icon component. */
                const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold whitespace-nowrap w-full text-left ${
                    isActive
                      ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-sm border border-white/50 dark:border-slate-700/50"
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {}
        <div className="flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl md:rounded-[2rem] shadow-sm border border-white dark:border-slate-800 p-5 md:p-10 relative overflow-hidden">
          {}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8">Account Settings</h2>
              
              <div className="space-y-8 max-w-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 rounded-3xl border border-white dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center font-black text-2xl shrink-0">
                    {name ? (name.includes(" ") ? name.split(" ")[0][0] + name.split(" ")[1][0] : name.substring(0, 2)).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">{name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">{email}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                      <Lock size={18} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Change Password
                  </h3>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? "text" : "password"}
                          {...register("currentPassword")}
                          placeholder="••••••••"
                          className={`w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 transition-all text-slate-800 dark:text-white font-medium pr-12 ${
                            errors.currentPassword 
                              ? "border-red-300 dark:border-red-500/50 focus:border-red-400 focus:ring-red-500/10" 
                              : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-indigo-500/10"
                          }`}
                        />
                        {currentPasswordValue && (
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/80 dark:bg-slate-800/80 p-1 rounded-lg backdrop-blur-sm"
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        )}
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                          {errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"}
                          {...register("newPassword")}
                          placeholder="••••••••"
                          className={`w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 transition-all text-slate-800 dark:text-white font-medium pr-12 ${
                            errors.newPassword 
                              ? "border-red-300 dark:border-red-500/50 focus:border-red-400 focus:ring-red-500/10" 
                              : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-indigo-500/10"
                          }`}
                        />
                        {newPasswordValue && (
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/80 dark:bg-slate-800/80 p-1 rounded-lg backdrop-blur-sm"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        )}
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500 inline-block shrink-0"></span>
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    {(apiError || apiSuccess) && (
                      <div className="pt-2">
                        <ErrorMessage message={apiError} />
                        <SuccessMessage message={apiSuccess} />
                      </div>
                    )}

                    <div className="pt-6">
                      <button 
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                          isValid && !isSubmitting
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98]"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                        {isSubmitting ? "Saving Changes..." : "Save Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8">Privacy Options</h2>
              
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-5 rounded-2xl border border-white dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="pr-4">
                    <p className="font-bold text-slate-800 dark:text-white">Private Profile</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Only approved followers can see your posts and photos.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-5 rounded-2xl border border-white dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="pr-4">
                    <p className="font-bold text-slate-800 dark:text-white">Search Engine Indexing</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Allow search engines (like Google) to link to your profile.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8">Appearance</h2>
              
              <div className="space-y-4 max-w-2xl">
                <div 
                  onClick={toggleDarkMode}
                  className="flex items-center justify-between p-5 rounded-2xl border border-white dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                >
                  <div className="pr-4 flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                      <Moon size={20} className="text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Switch between light and dark themes.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
                    <div className="w-12 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
