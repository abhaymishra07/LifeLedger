import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Target,
  Plus,
  Star,
  StarOff,
  Trash2,
  Calendar,
  Clock,
  TrendingUp,
  Sun,
  Moon,
  Activity,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


const LOCAL_KEY = "my_goals_v1";
const THEME_KEY = "my_goals_theme_v1";
const HISTORY_KEY = "my_goals_history_v1";

const defaultCategories = ["Daily", "Weekly", "Monthly", "Yearly"];
const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

const makeId = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const initialDemoGoals = [
  {
    id: makeId("g_"),
    text: "Morning run (3km)",
    category: "Daily",
    favorite: true,
    completed: false,
    subtasks: [
      { id: makeId("s_"), text: "Warm up", done: true },
      { id: makeId("s_"), text: "Run 3km", done: false },
      { id: makeId("s_"), text: "Cool down", done: false },
    ],
  },
  {
    id: makeId("g_"),
    text: "Finish project milestone",
    category: "Weekly",
    favorite: false,
    completed: false,
    subtasks: [{ id: makeId("s_"), text: "Write tests", done: false }],
  },
];

const goals = () => {
  // State
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Daily");
  const [theme, setTheme] = useState("light");
  const [showDashboard, setShowDashboard] = useState(true);
  const dragIndex = useRef(null);

  // History for simple progress line: records of {date: 'YYYY-MM-DD', completedCount: n}
  const [history, setHistory] = useState([]);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const t = localStorage.getItem(THEME_KEY);
      const h = localStorage.getItem(HISTORY_KEY);

      if (raw) setItems(JSON.parse(raw));
      else setItems(initialDemoGoals);

      if (t) setTheme(t);
      if (h) setHistory(JSON.parse(h));
    } catch (err) {
      console.warn("Failed to load local data:", err);
      setItems(initialDemoGoals);
    }
  }, []);

  // persist items & theme & history
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("unable to save items", e);
    }
  }, [items]);
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn("unable to save history", e);
    }
  }, [history]);

  // helpers
  const addGoal = () => {
    if (!input.trim()) return;
    const newG = {
      id: makeId("g_"),
      text: input.trim(),
      category: selectedCategory,
      favorite: false,
      completed: false,
      subtasks: [],
    };
    setItems((s) => [newG, ...s]);
    setInput("");
  };

  const removeGoal = (id) => {
    setItems((s) => s.filter((g) => g.id !== id));
  };

  const toggleFavorite = (id) => {
    setItems((s) => s.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g)));
  };

  const addSubtask = (goalId, text) => {
    if (!text.trim()) return;
    setItems((s) =>
      s.map((g) =>
        g.id === goalId
          ? { ...g, subtasks: [...g.subtasks, { id: makeId("s_"), text: text.trim(), done: false }] }
          : g
      )
    );
  };

  const toggleSubtask = (goalId, subId) => {
    setItems((s) =>
      s.map((g) =>
        g.id === goalId
          ? { ...g, subtasks: g.subtasks.map((st) => (st.id === subId ? { ...st, done: !st.done } : st)) }
          : g
      )
    );
  };

  const removeSubtask = (goalId, subId) => {
    setItems((s) => s.map((g) => (g.id === goalId ? { ...g, subtasks: g.subtasks.filter((st) => st.id !== subId) } : g)));
  };

  const toggleGoalComplete = (id) => {
    setItems((s) =>
      s.map((g) => {
        if (g.id === id) {
          const next = { ...g, completed: !g.completed };
          // if completed, mark all subtasks done
          if (next.completed) {
            next.subtasks = next.subtasks.map((st) => ({ ...st, done: true }));
            recordCompletion();
          }
          return next;
        }
        return g;
      })
    );
  };

  // When a goal is completed (toggle to true), record in history for today
  const recordCompletion = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setHistory((h) => {
      const copy = [...h];
      const idx = copy.findIndex((r) => r.date === today);
      if (idx >= 0) copy[idx].completedCount += 1;
      else copy.push({ date: today, completedCount: 1 });
      // keep last 30 days
      const last30 = copy.slice(-30);
      return last30;
    });
  };

  // Progress helpers
  const progressOf = (goal) => {
    if (!goal.subtasks || goal.subtasks.length === 0) return goal.completed ? 100 : 0;
    const done = goal.subtasks.filter((s) => s.done).length;
    return Math.round((done / goal.subtasks.length) * 100);
  };

  const overallProgress = useMemo(() => {
    if (items.length === 0) return 0;
    const total = items.reduce((acc, g) => acc + progressOf(g), 0);
    return Math.round(total / items.length);
  }, [items]);

  const completedCount = useMemo(() => items.filter((g) => g.completed || progressOf(g) === 100).length, [items]);

  // Badges logic
  const badges = useMemo(() => {
    const b = [];
    if (completedCount >= 5) b.push({ id: "b1", title: "Getting Started", icon: Award, meta: "5 completed goals" });
    if (completedCount >= 15) b.push({ id: "b2", title: "Momentum", icon: Activity, meta: "15 completed goals" });
    if (completedCount >= 30) b.push({ id: "b3", title: "Achievement", icon: Star, meta: "30+ completed goals" });
    return b;
  }, [completedCount]);

  // Stats for dashboard
  const categoryDistribution = useMemo(() => {
    const counts = defaultCategories.map((c) => items.filter((g) => g.category === c).length);
    return defaultCategories.map((c, i) => ({ name: c, value: counts[i], color: COLORS[i] }));
  }, [items]);

  // Progress history line (map history)
  const lineData = useMemo(() => {
    // ensure last 14 days
    const days = 14;
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const record = history.find((r) => r.date === dateKey);
      arr.push({ date: dateKey.slice(5), completed: record ? record.completedCount : 0 });
    }
    return arr;
  }, [history]);

  // Streak calculation: longest consecutive days with completedCount > 0 up to today
  const streak = useMemo(() => {
    if (!history || history.length === 0) return 0;
    const map = new Map(history.map((h) => [h.date, h.completedCount]));
    let s = 0;
    let cur = 0;
    // loop last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const val = map.get(dateKey) || 0;
      if (val > 0) {
        cur += 1;
        if (cur > s) s = cur;
      } else {
        cur = 0;
      }
    }
    return s;
  }, [history]);

  // Drag & drop handlers (native)
  const onDragStart = (e, idx) => {
    dragIndex.current = idx;
    e.dataTransfer.effectAllowed = "move";
    // firefox hack:
    e.dataTransfer.setData("text/plain", `${idx}`);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e, idx) => {
    e.preventDefault();
    const from = dragIndex.current != null ? dragIndex.current : Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    if (from === to) return;
    setItems((s) => {
      const copy = [...s];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
    dragIndex.current = null;
  };

  // Inline small component: GoalCard
  const GoalCard = ({ g, index }) => {
    const [subInput, setSubInput] = useState("");

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="mb-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/70 backdrop-blur border shadow-md flex flex-col"
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3 w-full">
            {/* progress mini ring */}
            <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
              <svg className="w-12 h-12">
                <circle cx="50%" cy="50%" r="18" stroke="rgba(0,0,0,0.06)" strokeWidth="4" fill="transparent" />
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  stroke="#6366F1"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="113"
                  strokeDashoffset={Math.round(113 - (progressOf(g) / 100) * 113)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-xs font-semibold text-gray-800 dark:text-gray-100">{progressOf(g)}%</div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{g.text}</h3>
                <span className="px-2 py-1 text-xs rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {g.category}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {g.subtasks.length > 0 ? (
                  <span>
                    {g.subtasks.filter((s) => s.done).length}/{g.subtasks.length} tasks done
                  </span>
                ) : (
                  <span>{g.completed ? "Completed" : "No subtasks"}</span>
                )}
              </div>

              {/* subtasks list */}
              <div className="mt-3 space-y-2">
                {g.subtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={() => toggleSubtask(g.id, s.id)}
                      className="w-4 h-4"
                    />
                    <div className={`flex-1 text-sm ${s.done ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200"}`}>
                      {s.text}
                    </div>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeSubtask(g.id, s.id)}
                      title="Remove subtask"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* add subtask */}
                <div className="flex gap-2 mt-1 items-center">
                  <input
                    placeholder="Add subtask..."
                    value={subInput}
                    onChange={(e) => setSubInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addSubtask(g.id, subInput);
                        setSubInput("");
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700/40 border text-gray-800 dark:text-gray-100"
                  />
                  <button
                    onClick={() => {
                      addSubtask(g.id, subInput);
                      setSubInput("");
                    }}
                    className="px-3 rounded-xl bg-indigo-600 text-white"
                    title="Add subtask"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* action column */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleGoalComplete(g.id)}
                className={`px-3 py-1 rounded-xl text-sm font-medium ${g.completed ? "bg-green-100 text-green-700" : "bg-gray-100 dark:bg-gray-700/40"
                  }`}
              >
                {g.completed ? "Done" : "Mark"}
              </button>
              <button onClick={() => toggleFavorite(g.id)} title="Favorite" className="p-1">
                {g.favorite ? <Star className="w-5 h-5 text-yellow-400" /> : <StarOff className="w-5 h-5 text-gray-400" />}
              </button>
              <button onClick={() => removeGoal(g.id)} title="Delete" className="p-1">
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>

            {/* small meta */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                {g.category === "Daily" && <Clock className="w-4 h-4" />}
                {g.category === "Weekly" && <TrendingUp className="w-4 h-4" />}
                {g.category === "Monthly" && <Calendar className="w-4 h-4" />}
                <span className="text-gray-600 dark:text-gray-300">{g.category}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Quick helpers for demo: clear history or reset demo
  const resetDemo = () => {
    setItems(initialDemoGoals);
    setHistory([]);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Controls & Add (main column spans 2 on lg) */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className=" mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
                <Target className="w-8 h-8 text-indigo-600" />
                Goals
              </h1>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm">
                  {items.length} total
                </div>
                <div className="px-3 py-1 rounded-xl bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm">
                  {completedCount} completed
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDashboard((s) => !s)}
                className="px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-800/60 dark:text-gray-200 shadow"
                title="Toggle dashboard"
              >
                Dashboard
              </button>
              <button onClick={resetDemo} className="px-3 py-2 rounded-lg bg-red-50 text-red-600">
                Reset Demo
              </button>
            </div>
          </motion.div>
          {/* Input area */}
          <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur border shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex gap-2 flex-wrap">
                {defaultCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium ${selectedCategory === c ? "bg-indigo-600 text-white" : "bg-white/50 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-indigo-700 dark:text-indigo-300 text-sm">{overallProgress}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">overall progress</div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                placeholder={`Add a ${selectedCategory.toLowerCase()} goal...`}
                className="flex-1 px-4 py-3 rounded-2xl border bg-white/60 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 outline-none"
              />
              <button onClick={addGoal} className="px-4 py-3 rounded-2xl bg-indigo-600 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>


          <p class="px-4 py-2 bg-red-100 border border-red-300 text-red-700 font-semibold rounded-lg shadow-sm flex items-center gap-2">
            <span class="text-red-600 text-lg">⚠️</span>
            This feature is currently under maintenance. Please avoid using it for now, as your data may be cleared. Thank you for understanding!
          </p>
          {/* Goals list */}
          <div>
            <AnimatePresence>
              {items.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No goals — add your first one ✨
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              {items.map((g, i) => (
                <GoalCard g={g} index={i} key={g.id} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Dashboard & Badges */}
        <aside className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-white/90 dark:bg-gray-800/60 backdrop-blur border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dashboard</h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">Insights</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Last 14d</div>
            </div>

            {showDashboard && (
              <div className="mt-4 space-y-4">
                <div style={{ height: 160 }} className="w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={60}
                        innerRadius={25}
                        paddingAngle={6}
                        labelLine={false}
                      >
                        {categoryDistribution.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ height: 140 }} className="w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="completed" stroke="#6366F1" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center gap-3 justify-between">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Current streak</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{streak}d</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedCount}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total goals finished</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Badges panel */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-white/90 dark:bg-gray-800/60 backdrop-blur border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Badges</h4>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Earned</div>
            </div>

            <div className="mt-3 space-y-3">
              {badges.length === 0 && <div className="text-sm text-gray-500 dark:text-gray-400">No badges yet — complete 5 goals to earn your first!</div>}
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/30 dark:bg-indigo-900/20">
                    <Icon className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{b.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{b.meta}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-white/90 dark:bg-gray-800/60 backdrop-blur border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Quick Stats</h4>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/40">
                <div className="text-xs text-gray-500 dark:text-gray-400">Avg progress</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{overallProgress}%</div>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/40">
                <div className="text-xs text-gray-500 dark:text-gray-400">Favorites</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{items.filter((g) => g.favorite).length}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/40">
                <div className="text-xs text-gray-500 dark:text-gray-400">With subtasks</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{items.filter((g) => g.subtasks && g.subtasks.length > 0).length}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/40">
                <div className="text-xs text-gray-500 dark:text-gray-400">Categories</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{new Set(items.map((g) => g.category)).size}</div>
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default goals;
