import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [funds, setFunds] = useState(0);

  // 🧠 Get today's date (YYYY-MM-DD)
  const getToday = () => new Date().toISOString().split("T")[0];

  // 🔥 Fetch user data & related info
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch user profile (funds, stocks, etc.)
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setFunds(data.funds || 0);
      } else {
        setUserData({ name: user.displayName || "User", funds: 0, stocks: 0 });
      }

      // Fetch habits completed today
      const today = getToday();
      const habitsRef = collection(db, "habits");
      const q = query(
        habitsRef,
        where("uid", "==", user.uid),
        where("date", "==", today),
        where("completed", "==", true)
      );

      const snapshot = await getDocs(q);
      setTodayCompleted(snapshot.size); // number of completed habits today
    };

    fetchData();
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  if (!userData)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 to-indigo-200 text-gray-800 flex flex-col transition-colors duration-700">
      {/* Header */}
      <header className="h-16 bg-white shadow-lg flex items-center justify-between px-6 rounded-md">
        <h2 className="text-2xl font-bold text-gray-800">Welcome 👋</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 font-bold text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Cards */}
      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Habit Card */}
        <DashboardCard
          title="Habit"
          value={`${todayCompleted} completed`}
          change={`+${todayCompleted} today`}
          onClick={() => navigate("/HabitPage")}
        />

        {/* Funds Card */}
        <DashboardCard
          title="Funds"
          value={`₹${funds}`}
          change={funds > 0 ? "+Available" : "No Funds"}
          onClick={() => navigate("/fund")}
        />

        {/* Stocks Card */}
        <DashboardCard
          title="Stocks"
          value={`₹${userData.stocks || 0}`}
          change="+1.2%"
          onClick={() => navigate("/stocks")}
        />
      </main>
    </div>
  );
};

export default Dashboard;

// 🧩 Reusable Card Component
const DashboardCard = ({ title, value, change, onClick }) => {
  const isPositive = change.startsWith("+");

  // 🎨 Constant gradient color (same for all cards)
  const bgClass = "from-indigo-800 to-teal-700";

  return (
    <div
      className={`bg-gradient-to-br ${bgClass} p-5 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between h-72`}
    >
      <div>
        <h3 className="text-3xl font-bold text-gray-200">{title}</h3>
        <p className="text-2xl font-bold mt-2 text-gray-100">{value}</p>
        <span
          className={`text-sm ${
            isPositive ? "text-teal-100" : "text-red-200"
          } font-medium`}
        >
          {change}
        </span>
      </div>
      <button
        onClick={onClick}
        className="mt-4 self-end bg-white/20 text-white text-sm px-4 py-2 rounded-md hover:bg-white/30 transition"
      >
        Go to →
      </button>
    </div>
  );
};
