import React, { useEffect, useState } from "react";
import {
  collection, addDoc, query, where, getDocs,
  onSnapshot, doc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase"; // Adjust path if needed
import HabitProgressChart from "./HabitProgressChart";
import HabitOverviewChart from "./HabitOverviewChart";
import { Plus, Trash2, CheckCheck, RotateCcw, Flame } from "lucide-react";

/* ─── helpers ─── */
const getTodayStr = () => new Date().toISOString().split("T")[0];

// Returns start of current month, e.g., "2026-04-01"
const getMonthStartStr = () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  // Formatting safely to YYYY-MM-DD
  const offset = monthStart.getTimezoneOffset() * 60000;
  return new Date(monthStart.getTime() - offset).toISOString().split("T")[0];
};

// Returns number of days in the current month (28, 29, 30, 31)
const getDaysInMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

// Returns current month name and year (e.g., "April 2026")
const getCurrentMonthName = () => {
  return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
};

// Returns 0-based index of today for arrays (0 = 1st, 30 = 31st)
const todayIndex = () => new Date().getDate() - 1;

/* ─── auto-reset logic ─── */
const resetIfNeeded = async (uid) => {
  const today = getTodayStr();
  const monthStart = getMonthStartStr();
  const daysInMonth = getDaysInMonth();

  const q = query(collection(db, "habits"), where("userId", "==", uid));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const habitRef = doc(db, "habits", docSnap.id);
    const updates = {};

    // ── Rule 1: new month OR migrating from old weekly structure → reset days ──
    if (!data.month || data.month < monthStart || !data.days || data.days.length !== daysInMonth) {
      updates.month = monthStart;
      updates.days = Array(daysInMonth).fill(false);
      updates.date = today;
    }

    // ── Rule 2: stale date within same month → ensure today's date is stored ──
    if (!updates.date && data.date !== today) {
      updates.date = today;
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(habitRef, updates);
    }
  }
};

/* ────────────────────────────────────────────── */

const HabitPage = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [mounted, setMounted] = useState(false);

  const daysInMonth = getDaysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    setMounted(true);
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await resetIfNeeded(currentUser.uid);

        const q = query(collection(db, "habits"), where("userId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setHabits(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return () => unsubscribe();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!habitName.trim() || !user) return;
    try {
      await addDoc(collection(db, "habits"), {
        name: habitName.trim(),
        date: getTodayStr(),
        completed: false,
        userId: user.uid,
        month: getMonthStartStr(),
        days: Array(daysInMonth).fill(false),
      });
      setHabitName("");
    } catch (err) {
      console.error("Error adding habit:", err);
    }
  };

  const toggleDay = async (habitId, index, current) => {
    // Only allow toggling today's column
    if (index !== todayIndex()) return;
    try {
      const updated = Array.isArray(current) ? [...current] : Array(daysInMonth).fill(false);
      updated[index] = !updated[index];
      await updateDoc(doc(db, "habits", habitId), { days: updated });
    } catch (err) {
      console.error("Error updating habit:", err);
    }
  };

  const deleteHabit = async (habitId) => {
    if (window.confirm("Delete this habit?")) {
      await deleteDoc(doc(db, "habits", habitId));
    }
  };

  const today = todayIndex();
  const allDoneToday = habits.length > 0 && habits.every((h) => h.days?.[today]);

  // Per-habit streak: consecutive days completed up to today
  const getStreak = (days) => {
    if (!Array.isArray(days)) return 0;
    let streak = 0;
    for (let i = today; i >= 0; i--) {
      if (days[i]) streak++;
      else break;
    }
    return streak;
  };

  return (
    <div className="min-h-screen bg-[#f0f4fc] dark:bg-[#080c14] transition-colors duration-500 relative overflow-x-hidden">

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Page Header ── */}
        <div
          className="transition-all duration-700"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-16px)" }}
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-violet-500 dark:text-violet-400 mb-1">
            Monthly Tracker
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-none">
              {getCurrentMonthName()}
            </h1>
            {allDoneToday && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400
                text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">
                <CheckCheck className="w-3.5 h-3.5" /> Today complete!
              </span>
            )}
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
        </div>

        {/* ── Add Habit Form ── */}
        <form
          onSubmit={handleAddHabit}
          className="flex flex-col sm:flex-row gap-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease 100ms, transform 0.6s ease 100ms",
          }}
        >
          <input
            type="text"
            placeholder="New habit name…"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl
              bg-white dark:bg-[#0e1420]
              border border-gray-200 dark:border-white/10
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-violet-400/50
              transition text-sm"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-3 rounded-xl
              bg-gradient-to-r from-violet-500 to-indigo-600
              hover:from-violet-400 hover:to-indigo-500
              text-white font-semibold text-sm
              shadow-lg shadow-violet-500/25
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Habit
          </button>
        </form>

        {/* ── Habit Table Card ── */}
        <div
          className="bg-white dark:bg-[#0e1420] rounded-2xl
            border border-gray-200/80 dark:border-white/5
            shadow-sm overflow-hidden"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
          }}
        >
          {/* Table header strip */}
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

          {/* Added custom scrollbar class via Tailwind if you have one, or standard browser scroll */}
          {/* <div className="overflow-x-auto pb-2"> */}
          <div className="overflow-x-auto pb-2 
  [scrollbar-width:thin] 
  [scrollbar-color:#cbd5e1_#f1f5f9] 
  dark:[scrollbar-color:#1f2937_#080c14] 
  [&::-webkit-scrollbar]:h-2 
  [&::-webkit-scrollbar-track]:rounded-full 
  [&::-webkit-scrollbar-track]:bg-slate-100 
  dark:[&::-webkit-scrollbar-track]:bg-[#080c14] 
  [&::-webkit-scrollbar-thumb]:rounded-full 
  [&::-webkit-scrollbar-thumb]:bg-slate-300 
  dark:[&::-webkit-scrollbar-thumb]:bg-gray-800 
  [&::-webkit-scrollbar-thumb:hover]:bg-slate-400 
  dark:[&::-webkit-scrollbar-thumb:hover]:bg-gray-700"
>
            <table className="min-w-[1000px] w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.03]">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider
                    text-gray-500 dark:text-gray-500 sticky left-0 bg-gray-50 dark:bg-[#0e1420] z-10 min-w-[140px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-black">
                    Habit
                  </th>
                  {daysArray.map((dayNum, idx) => (
                    <th key={idx} className={`px-1.5 py-3.5 text-center text-xs font-bold uppercase tracking-wider
                      ${idx === today
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-gray-400 dark:text-gray-600"}`}>
                      <div className="flex flex-col items-center gap-0.5 min-w-[28px]">
                        {dayNum}
                        {idx === today && (
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                    Streak
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                    Del
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={daysInMonth + 3}
                      className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="w-8 h-8 opacity-30" />
                        No habits yet — add one above!
                      </div>
                    </td>
                  </tr>
                ) : (
                  habits.map((habit, hi) => {
                    const streak = getStreak(habit.days);
                    return (
                      <tr
                        key={habit.id}
                        className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-150"
                        style={{
                          opacity: mounted ? 1 : 0,
                          transition: `opacity 0.4s ease ${300 + hi * 60}ms`,
                        }}
                      >
                        {/* Habit name */}
                        <td className="px-5 py-3.5 sticky left-0 bg-white dark:bg-[#0e1420]
                          group-hover:bg-gray-50 dark:group-hover:bg-[#111827] z-10 transition-colors duration-150 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:shadow-black">
                          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                            {habit.name}
                          </span>
                        </td>

                        {/* Day columns */}
                        {daysArray.map((_, idx) => {
                          const done = habit.days?.[idx] === true;
                          const isToday = idx === today;
                          const isPast = idx < today;
                          const isFuture = idx > today;

                          return (
                            <td key={idx} className="px-1 py-3 text-center">
                              <button
                                onClick={() => toggleDay(habit.id, idx, habit.days)}
                                disabled={!isToday}
                                title={isFuture ? "Future day" : isPast ? (done ? "Completed" : "Missed") : "Click to toggle"}
                                className={`
                                  w-7 h-7 mx-auto rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center
                                  ${isToday && done
                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-400/30 scale-110"
                                    : isToday && !done
                                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 hover:bg-violet-100 dark:hover:bg-violet-500/15 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer"
                                    : isPast && done
                                    ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-500"
                                    : isPast && !done
                                    ? "bg-red-50 dark:bg-red-500/10 text-red-300 dark:text-red-700"
                                    : "bg-gray-50 dark:bg-white/[0.02] text-gray-200 dark:text-gray-800 cursor-not-allowed"
                                  }
                                `}
                              >
                                {done ? "✓" : isPast ? "✕" : isFuture ? "–" : "○"}
                              </button>
                            </td>
                          );
                        })}

                        {/* Streak */}
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
                            ${streak > 0
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600"}`}>
                            <Flame className="w-3 h-3" />
                            {streak}
                          </span>
                        </td>

                        {/* Delete */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto
                              text-gray-300 dark:text-gray-700
                              hover:bg-red-50 dark:hover:bg-red-500/10
                              hover:text-red-500 dark:hover:text-red-400
                              transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Month summary bar ── */}
        {habits.length > 0 && (
          <div
            className="grid gap-1 sm:gap-2"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease 500ms",
              gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))`,
            }}
          >
            {daysArray.map((dayNum, idx) => {
              const doneCount = habits.filter((h) => h.days?.[idx]).length;
              const pct = Math.round((doneCount / habits.length) * 100) || 0;
              const isToday = idx === today;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1 sm:h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isToday ? "bg-violet-500" : pct === 100 ? "bg-emerald-500" : "bg-gray-300 dark:bg-white/20"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {/* Optional: Only show every 5th day label on small screens to avoid crowding */}
                  <span className={`text-[9px] sm:text-[10px] font-semibold ${isToday ? "text-violet-500 dark:text-violet-400" : "text-gray-400 dark:text-gray-600 hidden sm:block"}`}>
                    {dayNum}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Charts ── */}
        <div
          className="space-y-8"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 600ms",
          }}
        >
          <HabitProgressChart habits={habits} />
          <HabitOverviewChart habits={habits} />
        </div>
      </div>
    </div>
  );
};

export default HabitPage;