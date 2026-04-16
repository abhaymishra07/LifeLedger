import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [googleShowPopup, setGoogleShowPopup] = useState(false);
  const navigate = useNavigate();

  // Unified Form State
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Unified Firebase Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- SIGN IN LOGIC ---
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage("Logged in successfully!");
        setIsError(false);
        navigate("/dashboard");
      } else {
        // --- SIGN UP LOGIC ---
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        
        // Update Firebase Auth Profile
        await updateProfile(user, { displayName: formData.name });
        
        // Initialize Firestore Document for LifeLedger
        await setDoc(doc(db, "users", user.uid), {
          name: formData.name,
          funds: 0,
          habits: 0,
          stocks: 0,
        });

        setMessage("Account created successfully!");
        setIsError(false);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 flex flex-col md:flex-row">

      {/* LEFT SIDE - Branding & Graphic (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-slate-900/30 border-r border-slate-800 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5 font-bold text-xl text-white cursor-pointer">
          <div className="p-1.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Wallet size={18} className="text-white" />
          </div>
          <span>
            Life<span className="text-blue-400">Ledger</span>
          </span>
        </div>

        <div className="relative z-10 mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-6 leading-tight">
            Take control of your <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">life's portfolio.</span>
          </h2>

          <div className="space-y-5">
            {["Track funds and expenses in real-time", "Build and monitor daily habits", "Manage your stock portfolio"].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex items-center gap-3 text-slate-400"
              >
                <CheckCircle2 size={20} className="text-blue-400" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} LifeLedger. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-6 py-12 sm:p-12 relative min-h-screen md:min-h-0">
        <div className="w-full max-w-md relative z-10">

          <div className="md:hidden flex items-center gap-2.5 font-bold text-xl text-white mb-8">
            <div className="p-1.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Wallet size={18} className="text-white" />
            </div>
            <span>
              Life<span className="text-blue-400">Ledger</span>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              {isLogin
                ? "Enter your credentials to access your dashboard."
                : "Join to start tracking your funds, habits, and stocks."}
            </p>

            {/* Display Firebase Messages here */}
            {message && (
              <div className={`mb-6 rounded-xl border p-4 ${isError ? 'border-red-500/20 bg-red-500/10' : 'border-blue-500/20 bg-blue-500/10'}`}>
                <h3 className={`text-sm font-semibold mb-1 ${isError ? 'text-red-400' : 'text-blue-400'}`}>
                  {isError ? 'Authentication Error' : 'Success'} : <div className="text-white text-lg inline-block ml-1">
                    Life<span className="text-blue-400">Ledger</span>
                  </div>
                </h3>
                <p className={`text-sm mb-2 ${isError ? 'text-red-300' : 'text-blue-300'}`}>
                  {message}
                </p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-400">Password</label>
                  {isLogin && (
                    <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="my-5 p-3 rounded-lg transition-all">
                  <div id="terms-wrapper" className="flex items-start gap-3 text-sm">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        required
                        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 transition-colors"
                      />
                    </div>

                    <label htmlFor="terms" className="text-gray-600 cursor-pointer select-none leading-tight">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 underline-offset-4 hover:text-blue-700 transition-colors"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
              )}

              <motion.button
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className="w-full py-3.5 mt-4 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              <button
                onClick={() => setGoogleShowPopup(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              {googleShowPopup && (
                <div
                  className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                  onClick={() => setGoogleShowPopup(false)}
                >
                  <div
                    className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center transform transition-all animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                      We're currently engineering this feature. Stay tuned!
                    </p>
                    <button
                      onClick={() => setGoogleShowPopup(false)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle State */}
            <p className="text-center text-sm text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage(""); 
                  setIsError(false);
                }}
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}