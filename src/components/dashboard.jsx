import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ArrowRight, LogOut, CheckCircle, Wallet, TrendingUp, Moon, Sun } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [funds, setFunds] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/auth");
        return;
      }

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

  const toggleTheme = () => setDarkMode(!darkMode);

  if (!userData)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600 dark:text-gray-300">
        Loading Dashboard...
      </div>
    );

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen transition-colors duration-500`}>
      <div className="bg-[#f7fbff] dark:bg-[#0f172a] flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-gray-900 shadow-sm transition-colors">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Track your progress and stay on top of your goals
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-400" /> 
                  <span className="text-sm text-gray-700 dark:text-gray-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-gray-700" /> 
                  <span className="text-sm text-gray-700">Dark</span>
                </>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition"
            >
              <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logout</span>
            </button>
          </div>
        </header>

        {/* Cards */}
        <main className="flex-1 px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full transition-colors">
          <DashboardCard
            title="Habits"
            description="Build better habits and track your daily progress with streaks and insights."
            icon={<CheckCircle className="w-8 h-8 text-white" />}
            iconBg="from-sky-400 to-blue-500"
            buttonLabel="Go to Habits"
            onClick={() => navigate("/HabitPage")}
          />
          <DashboardCard
            title="Funds"
            description="Manage your finances, track expenses, and monitor your savings goals."
            icon={<Wallet className="w-8 h-8 text-white" />}
            iconBg="from-teal-400 to-emerald-500"
            buttonLabel="Go to Funds"
            onClick={() => navigate("/fund")}
          />
          <DashboardCard
            title="Stocks"
            description="Monitor your investments and stay updated with market trends and performance."
            icon={<TrendingUp className="w-8 h-8 text-white" />}
            iconBg="from-blue-500 to-indigo-500"
            buttonLabel="Go to Stocks"
            onClick={() => navigate("/stocks")}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

// Reusable Card
const DashboardCard = ({ title, description, icon, iconBg, buttonLabel, onClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between border border-transparent hover:border-blue-200 dark:hover:border-blue-800 h-80">
      <div>
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${iconBg} shadow-md mb-4`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>

      <button
        onClick={onClick}
        className="mt-6 flex items-center justify-between bg-[#f7fbff] dark:bg-gray-700 hover:bg-[#e7f1ff] dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        {buttonLabel}
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};
