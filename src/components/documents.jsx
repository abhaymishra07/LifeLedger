import React, { useState, useEffect } from "react";

const validateDriveURL = (url) =>
  /^https:\/\/drive\.google\.com\/[a-zA-Z0-9\/\-_?=]+$/.test(url);

function Documents() {
  const [form, setForm] = useState({ name: "", link: "" });
  const [docs, setDocs] = useState(() =>
    JSON.parse(localStorage.getItem("docs") || "[]")
  );
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    // Load theme preference from localStorage
    return localStorage.getItem("theme") === "dark";
  });

  // Persist docs in localStorage
  useEffect(() => {
    localStorage.setItem("docs", JSON.stringify(docs));
  }, [docs]);

  // Handle theme persistence
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.link) {
      setError("All fields are required.");
      return;
    }

    if (!validateDriveURL(form.link)) {
      setError("Invalid Google Drive link.");
      return;
    }

    setDocs([...docs, { ...form }]);
    setForm({ name: "", link: "" });
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${docs[index].name}"?`
    );
    if (!confirmed) return;

    const updatedDocs = docs.filter((_, i) => i !== index);
    setDocs(updatedDocs);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4 transition-colors duration-500">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-8 ring-1 ring-gray-200 dark:ring-gray-700 transition-colors duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            📂 My Documents
          </h2>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm"
          >
            {darkMode ? (
              <>
                🌞 <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                🌙 <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8"
        >
          <input
            name="name"
            placeholder="Document Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
          <input
            name="link"
            placeholder="Google Drive Link"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            required
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            + Add
          </button>
        </form>

        {error && (
          <div className="text-red-600 dark:text-red-400 mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Document List */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {docs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6 italic">
              No documents added yet. Start by adding one above!
            </p>
          ) : (
            docs.map((doc, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-4 px-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {doc.name}
                </span>
                <div className="flex gap-3">
                  <a
                    className="text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 px-4 py-1.5 rounded-lg hover:bg-indigo-600 hover:dark:bg-indigo-500 hover:text-white transition-all duration-300"
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                  <button
                    className="text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 px-4 py-1.5 rounded-lg hover:bg-red-600 hover:dark:bg-red-500 hover:text-white transition-all duration-300"
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      
    </div>
  );
}

export default Documents;
