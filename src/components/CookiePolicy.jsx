import React from "react";

const CookiePolicy = () => {
  return (
    <div className="relative min-h-screen bg-[#f7fbff] dark:bg-slate-950 py-12 px-6 sm:px-12 lg:px-24 transition-colors duration-500 overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Glassmorphism Content Wrapper */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-3xl p-8 sm:p-12">
          
          {/* Header Section */}
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
              Cookie Policy
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
              Last Updated: {new Date().toLocaleString('default', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <hr className="mt-8 border-slate-200/60 dark:border-slate-700/50" />
          </header>

          {/* Content Sections */}
          <section className="space-y-10 text-sm sm:text-base leading-relaxed">
            
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                1. What are Cookies?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Cookies are small text files stored on your device when you visit a website. They help the website recognize your device and remember information about your visit, like your preferences and login status.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                2. How SmartPower.io Uses Cookies
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We use cookies to enhance your experience on our energy telemetry dashboard. Specifically, we use them for:
              </p>
              <ul className="list-none space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-700 dark:text-slate-300">Authentication:</strong> To keep you logged in as you move between different sections of the dashboard.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-700 dark:text-slate-300">Preferences:</strong> To remember your dashboard settings, such as theme preferences or selected energy units.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                  <span><strong className="text-slate-700 dark:text-slate-300">Performance:</strong> To understand how users interact with our IoT tools so we can improve the platform's speed and reliability.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                3. Types of Cookies We Use
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">Type</th>
                      <th className="py-4 px-6 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-400 text-sm">
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-indigo-600 dark:text-indigo-400">Essential</td>
                      <td className="py-4 px-6">Necessary for the website to function. Cannot be switched off.</td>
                    </tr>
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-indigo-600 dark:text-indigo-400">Functional</td>
                      <td className="py-4 px-6">Used to remember settings and improve your dashboard experience.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-semibold ttext-indigo-600 dark:text-indigo-400">Analytics</td>
                      <td className="py-4 px-6">Helps us track energy telemetry usage patterns to optimize performance.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                4. Managing Your Cookies
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Most web browsers allow you to control cookies through their settings. You can delete all cookies currently on your device and set most browsers to prevent them from being placed. 
                <strong className="text-slate-700 dark:text-slate-300 font-semibold block mt-2">
                  Note: Disabling essential cookies may prevent you from accessing certain features of the SmartPower dashboard.
                </strong>
              </p>
            </div>

            {/* Questions Highlight Box */}
            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/50 rounded-2xl">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Questions?</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If you have any questions about our use of cookies, please contact the SmartPower.io engineering team via the support portal.
              </p>
            </div>

          </section>

          <footer className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-700/50 text-center">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Return to Home
            </a>
          </footer>
          
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;