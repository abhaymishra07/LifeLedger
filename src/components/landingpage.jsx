import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    Wallet,
    ListChecks,
    Moon,
    Sun,
    FilePlus,
    TrendingUp,
    Target,
} from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    // Load theme preference on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // Toggle light/dark mode
    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    const features = [
        {
            icon: <CheckCircle className="w-7 h-7" />,
            title: "Habit Tracker",
            color: "from-sky-400 to-blue-500",
            desc: "Build consistency with streaks and insights. Set habits, mark your days, and celebrate progress.",
        },
        {
            icon: <ListChecks className="w-7 h-7" />,
            title: "Daily Tasks",
            color: "from-orange-400 to-pink-500",
            desc: "Stay focused and accomplish your goals. Manage your to-do list and finish what matters most.",
        },
        {
            icon: <Wallet className="w-7 h-7" />,
            title: "Money Management",
            color: "from-teal-400 to-emerald-500",
            desc: "Track your expenses, visualize savings, and take control of your financial health effortlessly.",
        },
        {
            icon: <FilePlus className="w-7 h-7" />,
            title: "Documents",
            color: "from-purple-500 to-indigo-500",
            desc: "Upload, organize, and access your important documents securely — all in one place.",
        },
        {
            icon: <TrendingUp className="w-7 h-7" />,
            title: "Stocks",
            color: "from-blue-500 to-indigo-500",
            desc: "Track your investments, analyze performance, and make smarter financial decisions with ease.",
        },
        {
            icon: <Target className="w-7 h-7" />,
            title: "Goals",
            color: "from-yellow-400 to-orange-500",
            desc: "Set clear goals, track your progress, and stay motivated to achieve what matters most.",
        },
    ];

    return (
        <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-500">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-20 bg-white dark:bg-gray-900 shadow-md backdrop-blur-lg bg-opacity-90">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        LifeLedger
                    </h1>

                    <nav className="hidden md:flex gap-8 text-sm font-medium">
                        <a href="#features" className="hover:text-indigo-500 transition">
                            Features
                        </a>
                        <a href="#about" className="hover:text-indigo-500 transition">
                            About
                        </a>
                        <a href="#contact" className="hover:text-indigo-500 transition">
                            Contact
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button
                            onClick={() => navigate("/auth")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full shadow-md transition">
                            Sign In
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-36 pb-20 text-center px-6 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    One Dashboard to{" "}
                    <span className="text-indigo-600 dark:text-indigo-400">
                        Build Habits, Track Tasks,
                    </span>
                    <br />
                    and Manage Your Finances
                </motion.h2>

                <motion.p
                    className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 mb-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    Stay organized, productive, and mindful — all in one place. LifeLedger
                    helps you grow daily with a unified habit tracker, to-do list, and
                    money manager.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <button
                        onClick={() => navigate("/auth")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition text-lg flex items-center gap-2 mx-auto">
                        Get Started <ArrowRight size={20} />
                    </button>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white dark:bg-gray-950">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-center">
                                <div
                                    className={`w-16 h-16 mx-auto flex items-center justify-center bg-gradient-to-br ${feature.color} text-white rounded-xl`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mt-5 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* About Section */}
<section
  id="about"
  className="relative overflow-hidden py-28 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-950 dark:to-gray-900 text-center px-6"
>
  {/* Background Glow Effects */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-indigo-300 dark:bg-indigo-700 opacity-20 blur-3xl rounded-full animate-pulse"></div>
    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-800 opacity-20 blur-3xl rounded-full animate-pulse delay-2000"></div>
  </div>

  {/* Floating Particles (optional aesthetic touch) */}
  <div className="absolute inset-0 overflow-hidden -z-10">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-indigo-400/50 dark:bg-indigo-500/40 rounded-full animate-float"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${4 + Math.random() * 4}s`,
        }}
      ></div>
    ))}
  </div>

  {/* Title */}
  <motion.h2
    className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    Why LifeLedger?
  </motion.h2>

  {/* Subtitle */}
  <motion.p
    className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.8 }}
  >
    <p className="mb-3 italic text-gray-500 dark:text-gray-400">Take Control. Stay Focused. Grow Freely...</p>
    <p>
      One dashboard. Infinite clarity. <br />
      LifeLedger helps you track habits, set goals, and measure your growth — effortlessly. <br />
      Designed for simplicity, built for focus. No data tracking, no distractions. <br />
      Because your productivity should belong <span className="font-semibold text-indigo-500 dark:text-indigo-400">only to you.</span>
    </p>
  </motion.p>

  {/* Feature Cards */}
  <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {[
      {
        icon: "💡",
        title: "Smart Insights",
        text: "See your progress in elegant visuals that motivate real growth."
      },
      {
        icon: "🧘",
        title: "Calm & Minimal",
        text: "No clutter. No chaos. Just clarity and focus on what truly matters."
      },
      {
        icon: "🔒",
        title: "100% Private",
        text: "Your habits, your data — securely stored and never shared."
      }
    ].map((feature, index) => (
      <motion.div
        key={index}
        className="group relative p-8 bg-white/10 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-indigo-100 dark:border-gray-700 hover:shadow-2xl transition-all hover:scale-[1.03]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.2, duration: 0.7 }}
      >
        <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
          {feature.icon}
        </div>
        <h3 className="text-2xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{feature.text}</p>

        {/* subtle glow border */}
        <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-30 blur-lg transition-all duration-700"></div>
      </motion.div>
    ))}
  </div>

  {/* Call to Action */}
  <motion.div
    className="mt-20"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.8 }}
  >
  </motion.div>
</section>

            {/* Footer */}
            <footer id="contact" className="py-10 bg-gray-100 dark:bg-gray-900 text-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Contact Section */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
                        <a
                            href="mailto:abhay@example.com"
                            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21.75 8.25l-9.75 6-9.75-6M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V6.75z"
                                />
                            </svg>
                            abhaymishra77275@gmail.com
                        </a>

                        <span className="hidden md:inline text-gray-400">|</span>

                        <a
                            href="tel:+919876543210"
                            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M2.25 6.75c0-1.242 1.008-2.25 2.25-2.25h2.1a1.125 1.125 0 011.05.725l1.3 3.25a1.125 1.125 0 01-.25 1.175l-1.25 1.25a14.25 14.25 0 006.75 6.75l1.25-1.25a1.125 1.125 0 011.175-.25l3.25 1.3a1.125 1.125 0 01.725 1.05v2.1a2.25 2.25 0 01-2.25 2.25h-1.5C8.593 21 3 15.407 3 8.25v-1.5z"
                                />
                            </svg>
                            +91 9999999999
                        </a>

                        <span className="hidden md:inline text-gray-400">|</span>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 justify-center">
                            <a
                                href="https://github.com/abhaymishra07"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                                <i className="lab la-github text-lg"></i> GitHub
                            </a>
                            {/* <a
                                href="https://linkedin.com/in/abhaymishra"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                                <i className="lab la-linkedin text-lg"></i> LinkedIn
                            </a> */}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-300 dark:border-gray-700 w-1/3 mx-auto"></div>

                    {/* Copyright */}
                    <p className="pt-2">
                        © {new Date().getFullYear()} <span className="font-semibold text-gray-700 dark:text-gray-300">Abhay Mishra</span>. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    );
}
