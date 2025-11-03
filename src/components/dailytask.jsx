import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  Circle
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
import { db, auth } from "../firebase";

const DailyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // 🔥 Fetch all tasks in real-time for current user
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
        });

        return () => unsubscribe();
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // ➕ Add Task
  const addTask = async () => {
    if (newTask.trim() === "") return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first!");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      });
      setNewTask("");
      setShowInput(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Toggle Complete / Incomplete
  const toggleTask = async (id, currentValue) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !currentValue });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // 🗑️ Confirm Delete
  const confirmDelete = (index) => {
    setTaskToDelete(index);
  };

  // 🗑️ Delete Task from Firestore
  const deleteTask = async () => {
    try {
      const taskId = tasks[taskToDelete].id;
      await deleteDoc(doc(db, "tasks", taskId));
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-700">
      {/* Main Container */}
      <div className="w-full max-w-4xl border border-gray-300 dark:border-gray-700 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-xl p-8 transition-all">

        {/* Header */}
        <header className="flex justify-between items-center w-full mb-8 border-b border-gray-300 dark:border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            🗓️ Daily Tasks
          </h1>
          <button
            onClick={() => setShowInput(!showInput)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl shadow-md transition transform hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            Add Task
          </button>
        </header>

        {/* Input Field */}
        {showInput && (
          <div className="w-full flex items-center gap-3 mb-6 animate-fadeIn">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter your task..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={addTask}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl shadow transition transform hover:scale-105"
            >
              Add
            </button>
          </div>
        )}

        {/* Task List */}
        <div className="w-full space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
              No tasks yet. Click <span className="font-semibold text-indigo-500">“Add Task”</span> to get started.
            </p>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center justify-between px-5 py-4 rounded-2xl shadow-lg bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-transform duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTask(task.id, task.completed)} className="focus:outline-none">
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500 transition-transform duration-200" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-500 transition" />
                    )}
                  </button>
                  <span
                    className={`text-lg font-medium ${
                      task.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => confirmDelete(index)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-80 text-center border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Delete Task?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteTask}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
              <button
                onClick={() => setTaskToDelete(null)}
                className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTask;
