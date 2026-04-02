import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { apiClient } from "../api/client";
import { useNavigate, Link } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address manually formatted."),
  password: z.string().min(1, "Password is required tracking contextually."),
});

type LoginData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setServerError(null);
    try {
      await apiClient<{ message: string, user: any }>("/auth/login", { data });
      navigate("/");
    } catch (err: any) {
      setServerError(err.message || "An unexpected network collision occurred securely.");
    }
  };

  return (
    <div className="max-w-md mx-auto pt-24 pb-24 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500 w-full px-6">
      
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl font-extrabold tracking-[-0.02em] text-white font-headline">Welcome back</h1>
        <p className="text-white/50 text-sm">Log in seamlessly to trigger Video tracking logic.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-[#121212] border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl space-y-5">
        
        {serverError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
             <p>{serverError}</p>
          </div>
        )}

        <div className="space-y-2 relative">
          <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Email Address</label>
          <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input 
               {...register("email")}
               type="email"
               placeholder="hq@imaginexplainer.com"
               className="w-full bg-transparent border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4d8eff] focus:border-[#4d8eff] transition-all text-sm shadow-inner"
             />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1 font-medium px-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2 relative">
          <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Password</label>
          <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input 
               {...register("password")}
               type="password"
               placeholder="••••••••"
               className="w-full bg-transparent border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4d8eff] focus:border-[#4d8eff] transition-all text-sm tracking-widest shadow-inner"
             />
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1 font-medium px-1">{errors.password.message}</p>}
        </div>

        <button 
           disabled={isSubmitting}
           type="submit" 
           className="w-full bg-[#4d8eff] hover:bg-[#3b78eb] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(77,142,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2 text-sm tracking-wide"
        >
           {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In Securely"}
        </button>

        <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/30 text-xs font-medium uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button type="button" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 text-sm">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
        </button>

      </form>

      <p className="mt-8 text-sm text-white/50">
         Don't have an account tracking mapping? <Link to="/register" className="text-[#4d8eff] hover:text-blue-400 transition-colors ml-1 font-semibold select-none">Create globally.</Link>
      </p>

    </div>
  );
};
