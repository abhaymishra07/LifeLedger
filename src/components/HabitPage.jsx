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

const HabitPage = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");

  // Get today's date in YYYY-MM-DD format
  const getToday = () => new Date().toISOString().split("T")[0];

  // 🔐 Watch for logged-in user
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, "habits"), where("uid", "==", currentUser.uid));

        // Live update listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHabits(data);
        });

        // After setting up listener, run a one-time reset check
        await resetOldHabits(currentUser.uid);

        return () => unsubscribe();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 🧠 Reset old habits (called once per login/day)
  const resetOldHabits = async (uid) => {
    const today = getToday();
    const q = query(collection(db, "habits"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const habitRef = doc(db, "habits", docSnap.id);

      // If old habit, reset it
      if (data.date < today) {
        await updateDoc(habitRef, {
          completed: false,
          date: today,
        });
      }
    }
  };

  // 🟢 Add new habit
  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!habitName || !user) return alert("Please enter a habit name");

    try {
      await addDoc(collection(db, "habits"), {
        name: habitName.trim(),
        date: getToday(),
        completed: false,
        uid: user.uid,
      });

      setHabitName("");
    } catch (err) {
      console.error("Error adding habit:", err);
      alert("Error adding habit. Check console for details.");
    }
  };

  // 🔄 Toggle completion
  const toggleHabitCompletion = async (habitId, currentStatus) => {
    const habitRef = doc(db, "habits", habitId);
    await updateDoc(habitRef, { completed: !currentStatus });
  };

  // ❌ Delete habit
  const deleteHabit = async (habitId) => {
    if (window.confirm("Delete this habit?")) {
      await deleteDoc(doc(db, "habits", habitId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        🧘 Habit Tracker
      </h2>

      {/* ✅ Add Habit Form */}
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

      {/* 📋 Habit List (Scrollable) */}
<div className="max-w-4xl mx-auto mt-6 h-[400px] overflow-y-auto pr-2">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {habits.length === 0 ? (
      <p className="text-center text-gray-500 col-span-full">
        No habits yet. Add one!
      </p>
    ) : (
      habits.map((habit) => (
        <div
          key={habit.id}
          className="flex flex-col justify-between p-4 bg-white rounded-xl shadow hover:shadow-md transition"
        >
          <div>
            <p
              className={`font-medium text-lg ${
                habit.completed ? "line-through text-green-600" : ""
              }`}
            >
              {habit.name}
            </p>
            <small className="text-gray-500">Date: {habit.date}</small>
          </div>

          <div className="flex justify-between mt-3">
            <button
              onClick={() => toggleHabitCompletion(habit.id, habit.completed)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                habit.completed
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {habit.completed ? "Done" : "Mark Done"}
            </button>
            <button
              onClick={() => deleteHabit(habit.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>


      {/* 📊 Chart Section */}
      <div className="max-w-4xl mx-auto mt-10">
        <HabitProgressChart habits={habits} />
      </div>
    </div>
  );
};

export default HabitPage;
