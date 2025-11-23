// src/components/suggestionPage.jsx
import React, { useState, useEffect } from "react";
import { Lightbulb, Send, Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function SuggestionPage() {
  const [theme, setTheme] = useState("system");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Apply theme to <html> class list
  useEffect(() => {
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim()) return "Please enter your email.";
    // basic email check
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!suggestion.trim()) return "Please write a suggestion.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      // simple feedback for now
      window.alert(err);
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call; replace with real endpoint as needed
      await new Promise((res) => setTimeout(res, 700));
      window.alert("Suggestion submitted — thank you!");
      // clear form
      setName("");
      setEmail("");
      setSuggestion("");
    } catch (error) {
      console.error("submit error", error);
      window.alert("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-6"
      >
        {/* Header with theme toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Suggestions</h1>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md">
            <button
              type="button"
              aria-label="Light theme"
              onClick={() => setTheme("light")}
              className={`p-2 rounded ${theme === "light" ? "bg-gray-100 dark:bg-gray-700" : "bg-transparent"}`}
            >
              <Sun />
            </button>
            <button
              type="button"
              aria-label="Dark theme"
              onClick={() => setTheme("dark")}
              className={`p-2 rounded ${theme === "dark" ? "bg-gray-100 dark:bg-gray-700" : "bg-transparent"}`}
            >
              <Moon />
            </button>
            <button
              type="button"
              aria-label="System theme"
              onClick={() => setTheme("system")}
              className={`p-2 rounded ${theme === "system" ? "bg-gray-100 dark:bg-gray-700" : "bg-transparent"}`}
            >
              <Monitor />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300">
          Have ideas to improve the tracking tools or new features you want to see? We’d love to hear your thoughts!
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-black/30 rounded-2xl p-6 space-y-5 transition-colors duration-300"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggestion</label>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={5}
              placeholder="Describe your idea or improvement..."
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl w-full flex items-center gap-2 justify-center ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Send className="w-5 h-5" />
            {submitting ? "Submitting..." : "Submit Suggestion"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
