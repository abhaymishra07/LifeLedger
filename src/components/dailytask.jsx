import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListTodo,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  CheckCircle,
  LogOut,
} from "lucide-react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";
import { db, auth } from "../firebase"; // Adjust path if needed

// ==================== TASK HEADER COMPONENT ====================
function TaskHeader({ pendingCount, completedCount, totalCount }) {
  return (
    <header className="bg-gradient-to-br from-foreground to-secondary-foreground dark:from-card dark:to-secondary rounded-b-[2.5rem] shadow-header px-5 pt-6 pb-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/60 text-sm font-medium">Your Schedule</p>
            <h2 className="text-primary-foreground font-bold text-2xl">Task Manager</h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex-1">
            <p className="text-primary-foreground/60 text-xs uppercase tracking-wider font-medium mb-1">
              Pending Tasks
            </p>
            <h1 className="text-4xl font-black text-primary-foreground tracking-tight">
              {pendingCount}
            </h1>
          </div>

          <div className="flex gap-2">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 min-w-[80px] text-center">
              <div className="flex justify-center mb-1">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <p className="text-primary-foreground font-bold">{completedCount}</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 min-w-[80px] text-center">
              <div className="flex justify-center mb-1">
                <ListTodo className="w-4 h-4 text-primary" />
              </div>
              <p className="text-primary-foreground font-bold">{totalCount}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

// ==================== COMPACT TASK FORM ====================
function TaskForm({ onAddTask }) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;

    onAddTask(newTask.trim());
    setNewTask("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl shadow-card p-2 flex items-center gap-2 border border-border relative z-10 "
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Plus className="w-5 h-5 text-primary" />
      </div>
      <input
        className="flex-1 bg-transparent px-2 py-2 text-card-foreground placeholder:text-muted-foreground focus:outline-none"
        placeholder="Add a new task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button
        type="submit"
        disabled={!newTask.trim()}
        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-75 transition-opacity "
      >
        Add
      </button>
    </motion.form>
  );
}

// ==================== TASK CARD COMPONENT ====================
function TaskCard({ task, onToggle, onDeleteRequest }) {
  const isDone = task.completed;
  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
        isDone 
          ? "bg-secondary/30 border-transparent" 
          : "bg-card border-border shadow-card hover:shadow-card-hover"
      }`}
    >
      <button
        onClick={() => onToggle(task.id, task.completed)}
        className="flex-shrink-0 focus:outline-none"
      >
        {isDone ? (
          <CheckCircle2 className="w-6 h-6 text-success" />
        ) : (
          <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>

      <div 
        className="flex-1 min-w-0 cursor-pointer" 
        onClick={() => onToggle(task.id, task.completed)}
      >
        <p className={`font-medium truncate transition-all duration-300 ${
          isDone ? "text-muted-foreground line-through" : "text-card-foreground"
        }`}>
          {task.text}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formattedDate}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDeleteRequest(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ==================== DELETE CONFIRM MODAL ====================
function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onCancel}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          >
            <div className="bg-card w-full max-w-md rounded-t-3xl p-6 shadow-2xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="font-bold text-lg text-card-foreground">Delete Task?</h3>
                <p className="text-muted-foreground text-sm mt-1">This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3.5 rounded-xl font-semibold border border-border text-card-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3.5 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
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
const DailyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Tasks
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          tasksData.sort((a, b) => {
            if (a.completed === b.completed) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.completed ? 1 : -1;
          });
          
          setTasks(tasksData);
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setTasks([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleAddTask = async (taskText) => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first!");

    try {
      await addDoc(collection(db, "tasks"), {
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleTask = async (id, currentValue) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !currentValue });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (taskToDeleteId) {
        await deleteDoc(doc(db, "tasks", taskToDeleteId));
        setTaskToDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  if (loading) return <div className="p-6 text-center text-muted-foreground min-h-screen bg-background">Loading Tasks...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TaskHeader
        pendingCount={pendingCount}
        completedCount={completedCount}
        totalCount={tasks.length}
      />

      <main className="max-w-md mx-auto px-4 -mt-6">
        <TaskForm onAddTask={handleAddTask} />

        <div className="mt-8 space-y-3">
          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-muted-foreground">No tasks right now.</p>
                <p className="text-sm text-muted-foreground/60">Add a new task above</p>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggle={handleToggleTask} 
                  onDeleteRequest={setTaskToDeleteId} 
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <DeleteConfirmModal 
        isOpen={!!taskToDeleteId} 
        onConfirm={handleDelete} 
        onCancel={() => setTaskToDeleteId(null)} 
      />
    </div>
  );
};

export default DailyTask;