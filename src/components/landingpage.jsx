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
                className="py-24 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-950 dark:to-gray-900 text-center px-6"
            >
                <motion.h2
                    className="text-3xl font-bold mb-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Why LifeLedger?
                </motion.h2>
                <motion.p
                    className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <p>The future of productivity is private.</p>
                    <p>LifeLedger gives you one powerful dashboard to manage everything — tasks, goals, and focus — with zero data tracking, zero clutter, and maximum motivation.</p>
                </motion.p>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-gray-100 dark:bg-gray-900 text-center text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} Abhay Mishra. All rights reserved.
            </footer>
        </div>
    );
}
