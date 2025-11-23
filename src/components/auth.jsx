import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/* Reusable Social Icon Component */
const SocialIcon = ({ icon, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      if (onClick) onClick();
    }}
    className="border border-gray-300 dark:border-gray-700 rounded-lg w-10 h-10 flex items-center justify-center 
    hover:bg-indigo-100 dark:hover:bg-gray-800 text-indigo-600 dark:text-indigo-400 transition"
  >
    {icon}
  </a>
);

const Auth = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Sign Up Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: signUpName });
      await setDoc(doc(db, "users", user.uid), {
        name: signUpName,
        funds: 0,
        habits: 0,
        stocks: 0,
      });
      setMessage("✅ Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      setMessage("❌ " + error.message);
    }
    setLoading(false);
  };

  // ✅ Sign In Handler
  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      setMessage("✅ Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      setMessage("❌ Invalid Credentials");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4 transition-colors duration-500">
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden w-full max-w-md sm:max-w-2xl min-h-[520px] flex flex-col sm:flex-row transition-all duration-700`}
      >
        {/* ---------------- SIGN IN FORM ---------------- */}
        <div
          className={`w-full sm:w-1/2 flex flex-col items-center justify-center px-8 py-10 transition-all duration-700
            ${isActive
              ? "hidden sm:flex sm:translate-x-full sm:opacity-0 sm:z-0"
              : "flex sm:translate-x-0 sm:opacity-100 sm:z-10"
            }`}
        >
          <form
            onSubmit={handleSignin}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
              Sign In
            </h1>

            <span className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              or use your email and password
            </span>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800 border-none my-2 px-3 py-2 text-sm 
                         rounded-md w-full outline-none focus:ring-2 focus:ring-indigo-400 
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800 border-none my-2 px-3 py-2 text-sm 
                         rounded-md w-full outline-none focus:ring-2 focus:ring-indigo-400 
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs uppercase font-semibold px-6 py-2 rounded-md shadow-md transition mt-2 w-full"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* ---------------- SIGN UP FORM ---------------- */}
        <div
          className={`w-full sm:w-1/2 flex flex-col items-center justify-center px-8 py-10 transition-all duration-700
            ${isActive
              ? "flex sm:translate-x-0 sm:opacity-100 sm:z-10"
              : "hidden sm:-translate-x-full sm:opacity-0 sm:z-0"
            }`}
        >
          <form
            onSubmit={handleSignup}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
              Create Account
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Use your email for registration
            </span>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800 border-none my-2 px-3 py-2 text-sm 
                         rounded-md w-full outline-none focus:ring-2 focus:ring-indigo-400 
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800 border-none my-2 px-3 py-2 text-sm 
                         rounded-md w-full outline-none focus:ring-2 focus:ring-indigo-400 
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800 border-none my-2 px-3 py-2 text-sm 
                         rounded-md w-full outline-none focus:ring-2 focus:ring-indigo-400 
                         text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {/* <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs uppercase font-semibold px-6 py-2 rounded-md shadow-md transition mt-4 w-full"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button> */}
            <p class="px-4 py-2 bg-red-100 border border-red-300 text-red-700 font-semibold rounded-lg shadow-sm flex items-center gap-2">
              <span class="text-red-600 text-lg">⚠️</span>
              New registrations are temporarily paused. Thanks for your patience!
            </p>

          </form>
        </div>

        {/* Curved Overlay */}
        <div
          className={`hidden sm:flex absolute top-0 left-1/2 w-1/2 h-full transition-all duration-700 overflow-hidden z-20
            ${isActive
              ? "-translate-x-full rounded-[0_150px_100px_0]"
              : "translate-x-0 rounded-[150px_0_0_100px]"
            }`}
        >
          <div className="text-white h-full w-full flex flex-col justify-center items-center px-8 text-center transition-all duration-700 bg-gradient-to-br from-indigo-500 via-sky-400 to-blue-400">
            {!isActive ? (
              <>
                <h1 className="text-3xl font-bold mb-3 drop-shadow-md">Welcome Back!</h1>
                <p className="text-sm mb-4 opacity-90">
                  Enter your details to access your account
                </p>
                <button
                  onClick={() => setIsActive(true)}
                  className="bg-transparent border border-white text-white text-xs uppercase font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-indigo-700 transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-3 drop-shadow-md">Hello, Friend!</h1>
                <p className="text-sm mb-4 opacity-90">
                  Register now to explore all features
                </p>
                <button
                  onClick={() => setIsActive(false)}
                  className="bg-transparent border border-white text-white text-xs uppercase font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-indigo-700 transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="sm:hidden absolute top-3 right-3 z-30">
          <button
            onClick={() => setIsActive(!isActive)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-md transition"
          >
            {isActive ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-md px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100">
          {message}
        </div>
      )}
    </div>
  );
};

export default Auth;
