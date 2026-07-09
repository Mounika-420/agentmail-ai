import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, Sparkles, RefreshCw, AlertCircle, Eye, EyeOff } from "lucide-react";

interface AuthProps {
  onLoginSuccess: (user: any) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("marketing@agentmail.ai");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Sarah Jenkins");
  const [role, setRole] = useState("Marketing Manager");
  
  // Loading and Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const url = isForgot 
      ? "/api/auth/forgot-password" 
      : (isLogin ? "/api/auth/login" : "/api/auth/register");
    
    const body = isForgot 
      ? { email } 
      : (isLogin ? { email, password } : { name, email, password, role });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      if (isForgot) {
        setMessage(data.message);
      } else {
        // Logged in or registered successfully
        localStorage.setItem("agentmail_token", data.token);
        localStorage.setItem("agentmail_user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Decorative background gradients */}
      <div className="ambient-glow -top-20 -left-20" />
      <div className="ambient-glow-purple bottom-20 right-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8 relative z-10"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
            AgentMail <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/20">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-light">
            Autonomous Email Marketing Agent Engine
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs"
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up Name Field */}
          {!isLogin && !isForgot && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marketing@agentmail.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          {!isForgot && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Sign Up Role Selection */}
          {!isLogin && !isForgot && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Workspace Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Admin">Administrator</option>
                <option value="Viewer">Viewer (Read-Only)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            {isForgot 
              ? "Send Recovery Link" 
              : (isLogin ? "Sign In to AgentMail" : "Create Autonomous Workspace")}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center space-y-2">
          {isForgot ? (
            <button
              onClick={() => {
                setIsForgot(false);
                setError("");
                setMessage("");
              }}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Return to login portal
            </button>
          ) : (
            <p className="text-xs text-slate-400">
              {isLogin ? "New to AgentMail AI?" : "Already have an enterprise space?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setMessage("");
                }}
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline focus:outline-none"
              >
                {isLogin ? "Register Workspace" : "Login Instead"}
              </button>
            </p>
          )}

          <div className="pt-2 text-[10px] text-slate-600 font-mono">
            Demo Credentials: marketing@agentmail.ai / password123
          </div>
        </div>
      </motion.div>
    </div>
  );
}
