import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  ArrowRight, LogOut, CheckCircle, Wallet, TrendingUp,
  Moon, Sun, FilePlus, ListChecks, Target, Sparkles
} from "lucide-react";

const cards = [
  {
    title: "Habits",
    description: "Build streaks, track daily progress, and cultivate the routines that define you.",
    icon: CheckCircle,
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    accent: "#38bdf8",
    route: "/HabitPage",
    label: "Go to Habits",
    tag: "Daily",
  },
  {
    title: "Daily Tasks",
    description: "Conquer your to-do list. Stay sharp, stay organized, ship what matters.",
    icon: ListChecks,
    gradient: "from-orange-400 via-pink-500 to-rose-500",
    accent: "#fb923c",
    route: "/dailytask",
    label: "Go to Tasks",
    tag: "Today",
  },
  {
    title: "Funds",
    description: "Track every rupee. Visualize savings, monitor expenses, hit financial targets.",
    icon: Wallet,
    gradient: "from-teal-400 via-emerald-400 to-green-500",
    accent: "#2dd4bf",
    route: "/fund",
    label: "Go to Funds",
    tag: "Finance",
  },
  {
    title: "Documents",
    description: "Your secure digital vault. Upload, organize, and access important files anytime.",
    icon: FilePlus,
    gradient: "from-violet-500 via-purple-500 to-indigo-600",
    accent: "#a78bfa",
    route: "/documents",
    label: "Add Document",
    tag: "Storage",
  },
  {
    title: "Stocks",
    description: "Monitor your portfolio, track market trends, and make informed investment moves.",
    icon: TrendingUp,
    gradient: "from-blue-500 via-cyan-500 to-teal-400",
    accent: "#60a5fa",
    route: "/stocks",
    label: "Go to Stocks",
    tag: "Market",
  },
  {
    title: "Goals",
    description: "Dream big, plan smart. Set milestones and celebrate every step forward.",
    icon: Target,
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    accent: "#fbbf24",
    route: "/goals",
    label: "Check Goals",
    tag: "Vision",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [funds, setFunds] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) { navigate("/auth"); return; }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setFunds(data.funds || 0);
      } else {
        setUserData({ name: user.displayName || "User", funds: 0, stocks: 0 });
      }

      const habitsRef = collection(db, "habits");
      const q = query(habitsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      let completedCount = 0;
      snapshot.forEach((docSnap) => {
        const habit = docSnap.data();
        if (Array.isArray(habit.days)) {
          completedCount += habit.days.filter((d) => d).length > 0 ? 1 : 0;
        }
      });
      setTodayCompleted(completedCount);
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  if (!userData) return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen flex items-center justify-center`}>
      <div className="dark:bg-[#080c14] bg-slate-50 min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-gray-500 dark:text-gray-400 text-sm tracking-widest uppercase">Loading</span>
        </div>
      </div>
    </div>
  );

  const firstName = (userData?.name || "User").split(" ")[0];

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-[#f0f4fc] dark:bg-[#080c14] transition-colors duration-500 relative overflow-x-hidden">

        {/* Ambient orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-3xl" />
        </div>

        {/* ── HEADER ── */}
        <header className="fixed top-0 left-0 w-full z-30 px-4 sm:px-8 py-3
          bg-white/70 dark:bg-[#0d111e]/80 backdrop-blur-xl
          border-b border-gray-200/60 dark:border-white/5 transition-colors duration-500">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

            {/* Brand + greeting */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full  flex items-center justify-center flex-shrink-0">
                <img className="w-full h-full object-cover rounded-full" src="./avatar.png" alt="Description"></img>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
                  Hey, {firstName} 👋
                </h1>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate hidden sm:block">
                  Track your progress · stay ahead of your goals
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center
                  bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10
                  border border-gray-200 dark:border-white/10 transition-all duration-200"
                title="Toggle theme"
              >
                {darkMode
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4 text-gray-600" />}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                  bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10
                  border border-gray-200 dark:border-white/10
                  text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400
                  transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO STRIP ── */}
        <div className="relative z-10 pt-[72px]">
          <div className="max-w-6xl mx-auto px-6 pt-10 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-500 dark:text-blue-400 mb-2">
                  Your Command Center
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-none">
                  What are we<br className="hidden sm:block" /> working on today?
                </h2>
              </div>
              {/* Quick stats strip */}
              <div className="flex gap-3">
                <StatPill label="Habits done" value={todayCompleted} color="blue" />
                <StatPill label="Funds" value={`₹${funds.toLocaleString()}`} color="teal" />
              </div>
            </div>

            {/* Thin divider */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
          </div>
        </div>

        {/* ── GRID ── */}
        <main className="relative z-10 max-w-6xl mx-auto px-6 pt-6 pb-28
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <DashboardCard
              key={card.title}
              {...card}
              index={i}
              mounted={mounted}
              onClick={() => navigate(card.route)}
            />
          ))}
        </main>

        {/* ── SUGGESTION FAB ── */}
        <button
          onClick={() => navigate("/suggestionPage")}
          className="fixed bottom-6 right-6 z-30
            flex items-center gap-2 px-5 py-3 rounded-2xl
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-500 hover:to-indigo-500
            text-white text-sm font-semibold
            shadow-xl shadow-blue-500/30
            hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          Suggestion
        </button>
      </div>
    </div>
  );
};

export default Dashboard;


/* ─── Stat Pill ─── */
const colorMap = {
  blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  teal: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20",
};

const StatPill = ({ label, value, color }) => (
  <div className={`flex flex-col items-center px-4 py-2.5 rounded-2xl border text-center ${colorMap[color]}`}>
    <span className="text-xl font-black leading-none">{value}</span>
    <span className="text-[10px] font-medium uppercase tracking-wide mt-0.5 opacity-70">{label}</span>
  </div>
);


/* ─── Dashboard Card ─── */
const DashboardCard = ({ title, description, icon: Icon, gradient, accent, buttonLabel, onClick, tag, index, mounted }) => {
  return (
    <div
      className="group relative bg-white dark:bg-[#0e1420] rounded-2xl overflow-hidden
        border border-gray-200/80 dark:border-white/5
        hover:border-gray-300 dark:hover:border-white/10
        shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40
        transition-all duration-300 hover:-translate-y-1.5 cursor-pointer
        flex flex-col"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
      onClick={onClick}
    >
      {/* Colored top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />

      {/* Subtle gradient bleed on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 10% 0%, ${accent}14 0%, transparent 60%)` }}
      />

      <div className="p-6 flex flex-col flex-1 relative">

        {/* Icon + Tag row */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
            style={{ boxShadow: `0 8px 20px ${accent}40` }}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full
            bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500">
            {tag}
          </span>
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{description}</p>

        {/* CTA */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {buttonLabel}
          </span>
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center
              bg-gray-100 dark:bg-white/5
              group-hover:bg-blue-500 dark:group-hover:bg-blue-500
              transition-all duration-300 group-hover:translate-x-0.5"
          >
            <ArrowRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors duration-200" />
          </span>
        </div>
      </div>
    </div>
  );
};