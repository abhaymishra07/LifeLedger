import React, { useEffect, useMemo, useState } from "react";
import {
  Target,
  Plus,
  Star,
  Trash2,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle2,
  Circle,
  AlertTriangle,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOCAL_KEY = "my_goals_v1";
const HISTORY_KEY = "my_goals_history_v1";
const defaultCategories = ["Daily", "Weekly", "Monthly", "Yearly"];

const makeId = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// ==================== HEADER COMPONENT ====================
function GoalsHeader({ total, completed, progress, streak }) {
  return (
    <header className="bg-gradient-to-br from-foreground to-secondary-foreground dark:from-card dark:to-secondary rounded-b-[2.5rem] shadow-header px-5 pt-8 pb-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-primary-foreground/60 text-sm font-medium">Your Ambitions</p>
            <h2 className="text-primary-foreground font-bold text-2xl tracking-tight">Goal Tracker</h2>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-8">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center">
            <p className="text-primary-foreground/60 text-xs mb-1 text-center">Total</p>
            <p className="text-primary-foreground font-bold text-xl">{total}</p>
          </div>
          <div className="bg-success/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center">
            <p className="text-success-foreground/80 text-xs mb-1 text-center">Done</p>
            <p className="text-success-foreground font-bold text-xl">{completed}</p>
          </div>
          <div className="bg-primary/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center">
            <p className="text-primary-foreground/80 text-xs mb-1 text-center">Avg %</p>
            <p className="text-primary-foreground font-bold text-xl">{progress}%</p>
          </div>
          <div className="bg-warning/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center">
            <p className="text-warning-foreground/80 text-xs mb-1 text-center">Streak</p>
            <p className="text-warning-foreground font-bold text-xl">{streak}d</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ==================== DELETE CONFIRM MODAL ====================
function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40" onClick={onCancel}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          >
            <div className="bg-card w-full max-w-md rounded-t-3xl p-6 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="font-bold text-lg text-card-foreground">Delete Goal?</h3>
                <p className="text-muted-foreground text-sm mt-1">This will permanently remove this goal and its subtasks.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-semibold border border-border text-card-foreground hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button onClick={onConfirm} className="flex-1 py-3.5 rounded-xl font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==================== MAIN COMPONENT ====================
const Goals = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Daily");
  const [history, setHistory] = useState([]);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const h = localStorage.getItem(HISTORY_KEY);
      if (raw) setItems(JSON.parse(raw));
      if (h) setHistory(JSON.parse(h));
    } catch (err) {
      console.warn("Failed to load local data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist to local storage
  useEffect(() => {
    if (loading) return;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [items, history, loading]);

  // Helpers
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
    setItems([newG, ...items]);
    setInput("");
  };

  const removeGoal = () => {
    setItems(items.filter((g) => g.id !== goalToDelete));
    setGoalToDelete(null);
  };

  const toggleFavorite = (id) => {
    setItems(items.map((g) => (g.id === id ? { ...g, favorite: !g.favorite } : g)));
  };

  const addSubtask = (goalId, text) => {
    if (!text.trim()) return;
    setItems(items.map((g) =>
      g.id === goalId ? { ...g, subtasks: [...g.subtasks, { id: makeId("s_"), text: text.trim(), done: false }] } : g
    ));
  };

  const toggleSubtask = (goalId, subId) => {
    setItems(items.map((g) =>
      g.id === goalId ? { ...g, subtasks: g.subtasks.map((st) => (st.id === subId ? { ...st, done: !st.done } : st)) } : g
    ));
  };

  const removeSubtask = (goalId, subId) => {
    setItems(items.map((g) => (g.id === goalId ? { ...g, subtasks: g.subtasks.filter((st) => st.id !== subId) } : g)));
  };

  const recordCompletion = () => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory((h) => {
      const copy = [...h];
      const idx = copy.findIndex((r) => r.date === today);
      if (idx >= 0) copy[idx].completedCount += 1;
      else copy.push({ date: today, completedCount: 1 });
      return copy.slice(-30);
    });
  };

  const toggleGoalComplete = (id) => {
    setItems(items.map((g) => {
      if (g.id === id) {
        const next = { ...g, completed: !g.completed };
        if (next.completed) {
          next.subtasks = next.subtasks.map((st) => ({ ...st, done: true }));
          recordCompletion();
        }
        return next;
      }
      return g;
    }));
  };

  // Calculations
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

  const streak = useMemo(() => {
    if (!history || history.length === 0) return 0;
    const map = new Map(history.map((h) => [h.date, h.completedCount]));
    let s = 0, cur = 0;
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const val = map.get(d.toISOString().slice(0, 10)) || 0;
      if (val > 0) { cur += 1; if (cur > s) s = cur; }
      else cur = 0;
    }
    return s;
  }, [history]);

  // Subtask Input State per Goal Card
  const GoalCard = ({ g }) => {
    const [subInput, setSubInput] = useState("");
    const progress = progressOf(g);
    const isDone = g.completed || progress === 100;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className={`p-5 rounded-2xl border transition-all duration-300 ${isDone ? "bg-secondary/30 border-transparent" : "bg-card border-border shadow-card hover:shadow-card-hover"
          }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {g.favorite && <Star className="w-4 h-4 text-warning fill-warning" />}
              <h3 className={`text-lg font-bold ${isDone ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                {g.text}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                {g.category === "Daily" && <Clock className="w-3 h-3" />}
                {g.category === "Weekly" && <TrendingUp className="w-3 h-3" />}
                {g.category === "Monthly" && <CalendarDays className="w-3 h-3" />}
                {g.category === "Yearly" && <Calendar className="w-3 h-3" />}
                {g.category}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" /> {progress}% Done
              </span>
            </div>

            {/* Subtasks */}
            <div className="space-y-2 mb-3">
              {g.subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-3 group/sub">
                  <button onClick={() => toggleSubtask(g.id, s.id)} className="focus:outline-none flex-shrink-0">
                    {s.done ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />}
                  </button>
                  <span className={`text-sm flex-1 ${s.done ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                    {s.text}
                  </span>
                  <button onClick={() => removeSubtask(g.id, s.id)} className="opacity-0 group-hover/sub:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            {!isDone && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  placeholder="Add a step..."
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { addSubtask(g.id, subInput); setSubInput(""); }
                  }}
                  className="flex-1 text-sm bg-secondary px-3 py-2 rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={() => { addSubtask(g.id, subInput); setSubInput(""); }}
                  disabled={!subInput.trim()}
                  className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => toggleGoalComplete(g.id)}
              className={`p-2 rounded-xl transition-colors ${isDone ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground hover:text-success hover:bg-success/10"
                }`}
              title="Mark Goal Complete"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleFavorite(g.id)}
              className={`p-2 rounded-xl transition-colors ${g.favorite ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground hover:text-warning hover:bg-warning/10"
                }`}
              title="Favorite"
            >
              <Star className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGoalToDelete(g.id)}
              className="p-2 rounded-xl bg-secondary text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Delete Goal"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <GoalsHeader total={items.length} completed={completedCount} progress={overallProgress} streak={streak} />

      <main className="max-w-xl mx-auto px-4 -mt-6">

        {/* ADD GOAL FORM */}
        <div className="bg-card rounded-3xl shadow-card p-5 mb-8 border border-border">
          <div className="flex gap-2 flex-wrap mb-4">
            {defaultCategories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
              placeholder={`What is your next ${selectedCategory.toLowerCase()} goal?`}
              className="flex-1 bg-secondary px-4 py-3 rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={addGoal}
              disabled={!input.trim()}
              className="bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>




        <p class="px-4 py-2 bg-red-100 border border-red-300 text-red-700 font-semibold rounded-lg shadow-sm flex items-center gap-2">
          <span class="text-red-600 text-lg">⚠️</span>
          This feature is currently under maintenance. Please avoid using it for now, as your data may be cleared. Thank you for understanding!
        </p>




        {/* GOALS LIST */}
        <div className="space-y-4">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-muted-foreground">No goals set yet.</p>
                <p className="text-sm text-muted-foreground/60">Type a goal above to start tracking!</p>
              </motion.div>
            ) : (
              items.map((g) => <GoalCard key={g.id} g={g} />)
            )}
          </AnimatePresence>
        </div>
      </main>

      <DeleteConfirmModal
        isOpen={!!goalToDelete}
        onConfirm={removeGoal}
        onCancel={() => setGoalToDelete(null)}
      />
    </div>
  );
};

export default Goals;