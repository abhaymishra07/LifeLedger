import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      // Cleanup function to prevent memory leaks if user leaves page fast
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10">
        <div className="flex items-start gap-4">
          {/* Cookie Icon */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-2xl border border-blue-100/50 dark:border-blue-800/50 flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-slate-800 dark:text-slate-100 font-bold text-sm tracking-tight">Cookie Policy</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
              We use cookies to improve your energy tracking experience. By clicking "Accept", you agree to our 
              <a href="/cookies" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1 transition-colors">
                Cookie Policy
              </a>.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={acceptCookies}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none hover:-translate-y-0.5"
          >
            Accept All
          </button>
          {/* <button
            onClick={() => setIsVisible(false)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
          >
            Decline
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;