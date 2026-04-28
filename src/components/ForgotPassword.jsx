import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset link sent! Please check your inbox.");
            setEmail(""); // clear the input
        } catch (err) {
            if (err.code === "auth/user-not-found") {
                setError("No account found with this email.");
            } else if (err.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else {
                setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#f7fbff] dark:bg-slate-950 px-4 transition-colors duration-500 overflow-hidden">

            {/* Ambient Background Glows (Visible in both Light and Dark modes) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 dark:bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-indigo-400/30 dark:bg-indigo-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/auth")}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </button>

                {/* Glassmorphic Card (bg-white/80 is Light Theme, dark:bg-slate-800/60 is Dark Theme) */}
                <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white dark:border-slate-700/50 shadow-xl dark:shadow-2xl rounded-3xl p-8 transition-all">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 mb-5 shadow-sm">
                            <Mail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Forgot Password?
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{message}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form
                        action="https://formspree.io/f/xqewplqo"
                        method="POST"
                        onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Remembered your password?{" "}
                            <Link to="/auth" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-colors">
                                Log in here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;