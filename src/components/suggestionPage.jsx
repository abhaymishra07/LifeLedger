// src/components/suggestionPage.jsx
import React, { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function SuggestionPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Suggestions
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300">
          Have ideas to improve the tracking tools or new features you want to see?
          We’d love to hear your thoughts!
        </p>

        {/* === Formspree Form === */}
        <form
          action="https://formspree.io/f/mdkvnqnl" 
          method="POST"
          className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-black/30 rounded-2xl p-6 space-y-5 transition-colors duration-300"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 
              dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 
              dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 
              dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 
              dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Suggestion
            </label>
            <textarea
              name="suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={5}
              placeholder="Describe your idea or improvement..."
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 
              dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 
              dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 
            rounded-xl w-full flex items-center gap-2 justify-center"
          >
            <Send className="w-5 h-5" />
            Submit Suggestion
          </button>
        </form>
      </motion.div>
    </div>
  );
}
