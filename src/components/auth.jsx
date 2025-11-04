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
    className="border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-indigo-200 p-2 sm:p-4">
      <div
        className={`relative bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-md sm:max-w-2xl min-h-[520px] flex flex-col sm:flex-row transition-all duration-700`}
      >
        {/* ---------------- SIGN IN FORM ---------------- */}
        <div
          className={`w-full sm:w-1/2 flex flex-col items-center justify-center px-8 py-10 transition-all duration-700
            ${isActive ? "hidden sm:flex sm:translate-x-full sm:opacity-0 sm:z-0" : "flex sm:translate-x-0 sm:opacity-100 sm:z-10"}
          `}
        >
          <form
            onSubmit={handleSignin}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            
            <span className="text-xs text-gray-500 mb-3">
              or use your email and password
            </span>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-3 py-2 text-sm rounded-md w-full outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-3 py-2 text-sm rounded-md w-full outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white text-xs uppercase font-semibold px-6 py-2 rounded-md hover:bg-teal-700 transition mt-2 w-full"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* ---------------- SIGN UP FORM ---------------- */}
        <div
          className={`w-full sm:w-1/2 flex flex-col items-center justify-center px-8 py-10 transition-all duration-700
            ${isActive ? "flex sm:translate-x-0 sm:opacity-100 sm:z-10" : "hidden sm:-translate-x-full sm:opacity-0 sm:z-0"}
          `}
        >
          <form
            onSubmit={handleSignup}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>
            <span className="text-xs text-gray-500 mb-3">
              use your email for registration
            </span>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-3 py-2 text-sm rounded-md w-full outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-3 py-2 text-sm rounded-md w-full outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-3 py-2 text-sm rounded-md w-full outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white text-xs uppercase font-semibold px-6 py-2 rounded-md hover:bg-teal-700 transition mt-4 w-full"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Overlay for desktop */}
        <div
          className={`hidden sm:flex absolute top-0 left-1/2 w-1/2 h-full transition-all duration-700 rounded-[150px_0_0_100px] overflow-hidden z-20 bg-gradient-to-r from-indigo-500 to-teal-500
            ${isActive ? "-translate-x-full rounded-[0_150px_100px_0]" : "translate-x-0"}
          `}
        >
          <div className="text-white h-full w-full flex flex-col justify-center items-center px-8 text-center transition-all duration-700">
            {!isActive ? (
              <>
                <h1 className="text-3xl font-bold mb-3">Welcome Back!</h1>
                <p className="text-sm mb-4">
                  Enter your details to access your account
                </p>
                <button
                  onClick={() => setIsActive(true)}
                  className="bg-transparent border border-white text-white text-xs uppercase font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-teal-700 transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-3">Hello, Friend!</h1>
                <p className="text-sm mb-4">
                  Register with your details to use all site features
                </p>
                <button
                  onClick={() => setIsActive(false)}
                  className="bg-transparent border border-white text-white text-xs uppercase font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-teal-700 transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle button */}
        <div className="sm:hidden absolute top-3 right-3 z-30">
          <button
            onClick={() => setIsActive(!isActive)}
            className="bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-md"
          >
            {isActive ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md px-4 py-2 rounded-lg text-sm">
          {message}
        </div>
      )}
    </div>
  );
};

export default Auth;
