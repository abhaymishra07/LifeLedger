import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import HabitProgressChart from "./HabitProgressChart";
import HabitOverviewChart from "./HabitOverviewChart";

const HabitPage = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const sunday = new Date(now.setDate(diff));
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  const getToday = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, "habits"), where("userId", "==", currentUser.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHabits(data);
        });

        await resetOldHabits(currentUser.uid);
        return () => unsubscribe();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const resetOldHabits = async (uid) => {
    const today = getToday();
    const q = query(collection(db, "habits"), where("userId", "==", uid));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const habitRef = doc(db, "habits", docSnap.id);

      if (data.date < today) {
        await updateDoc(habitRef, {
          completed: false,
          date: today,
        });
      }
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!habitName || !user) return alert("Please enter a habit name");

    try {
      await addDoc(collection(db, "habits"), {
        name: habitName.trim(),
        date: getToday(),
        completed: false,
        userId: user.uid, // ✅ changed from uid → userId
        week: getWeekStart().toISOString().split("T")[0],
        days: Array(7).fill(false),
      });

      setHabitName("");
    } catch (err) {
      console.error("Error adding habit:", err);
      alert("Error adding habit. Check console for details.");
    }
  };

  const toggleDay = async (habitId, index, current) => {
    try {
      const habitRef = doc(db, "habits", habitId);
      const updatedDays = Array.isArray(current) ? [...current] : Array(7).fill(false);
      updatedDays[index] = !updatedDays[index];
      await updateDoc(habitRef, { days: updatedDays });
    } catch (err) {
      console.error("Error updating habit:", err);
    }
  };

  const deleteHabit = async (habitId) => {
    if (window.confirm("Delete this habit?")) {
      await deleteDoc(doc(db, "habits", habitId));
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-center mb-4">
        🧘 Habit Tracker
      </h2>

      <form
        onSubmit={handleAddHabit}
        className="flex flex-col sm:flex-row gap-3 justify-center items-center"
      >
        <input
          type="text"
          placeholder="Enter habit name"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          className="border p-2 rounded-lg w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Habit
        </button>
      </form>

      {/* 📋 Habit Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-y-auto max-h-[400px] relative">
          <table className="min-w-[700px] w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-[5]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold bg-white sticky left-0 z-[2]">
                  Habit
                </th>
                {days.map((day, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-center">
                    {day}
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.length === 0 ? (
                <tr>
                  <td
                    colSpan={days.length + 2}
                    className="text-center py-4 text-gray-500"
                  >
                    No habits yet. Add one!
                  </td>
                </tr>
              ) : (
                habits.map((habit) => (
                  <tr key={habit.id} className="border-b hover:bg-gray-50">
                    <td
                      className="px-4 py-3 font-medium sticky left-0 bg-white z-[1]"
                      style={{ pointerEvents: "auto" }}
                    >
                      {habit.name}
                    </td>
                    {days.map((day, idx) => (
                      <td key={idx} className="text-center px-4 py-2">
                        <button
                          onClick={() => toggleDay(habit.id, idx, habit.days)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            habit.days?.[idx]
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          {habit.days?.[idx] ? "Done" : "Mark"}
                        </button>
                      </td>
                    ))}
                    <td className="text-center">
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="max-w-6xl mx-auto mt-10 space-y-10">
        <HabitProgressChart habits={habits} />
        <HabitOverviewChart habits={habits} />
      </div>
    </div>
  );
};

export default HabitPage;
