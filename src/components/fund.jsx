import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  HandCoins,
  Wallet,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Receipt,
  User,
  History,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase"; // Adjust path if needed

// ==================== CONSTANTS ====================
const categoryConfig = {
  income: {
    icon: ArrowDownLeft,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "Income",
  },
  expense: {
    icon: ArrowUpRight,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Expense",
  },
  lent: {
    icon: HandCoins,
    color: "text-warning",
    bgColor: "bg-warning/10",
    label: "Lent",
  },
  borrowed: {
    icon: Wallet,
    color: "text-primary",
    bgColor: "bg-primary/10",
    label: "Borrowed",
  },
};

const categories = [
  { value: "income", label: "Income", icon: TrendingUp, color: "bg-success text-success-foreground" },
  { value: "expense", label: "Expense", icon: TrendingDown, color: "bg-destructive text-destructive-foreground" },
  { value: "lent", label: "Lent", icon: HandCoins, color: "bg-warning text-warning-foreground" },
  { value: "borrowed", label: "Borrowed", icon: Wallet, color: "bg-primary text-primary-foreground" },
];

// ==================== BALANCE HEADER COMPONENT ====================
function BalanceHeader({ balance, income, expense, isDark, onThemeToggle }) {
  return (
    <header className="bg-gradient-to-br from-foreground to-secondary-foreground dark:from-card dark:to-secondary rounded-b-[2.5rem] shadow-header px-5 pt-6 pb-10">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            {/* <p className="text-primary-foreground/60 text-sm font-medium">Welcome back</p> */}
            <h2 className="text-primary-foreground font-bold text-2xl">Finance Tracker</h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <p className="text-primary-foreground/60 text-sm uppercase tracking-wider font-medium mb-1">
            Current Balance
          </p>
          <h1 className="text-5xl font-black text-primary-foreground tracking-tight">
            ₹{balance.toLocaleString("en-IN")}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <div className="flex-1 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <span className="text-primary-foreground/60 text-sm">Income</span>
            </div>
            <p className="text-primary-foreground font-bold text-lg">
              +₹{income.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex-1 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-primary-foreground/60 text-sm">Expense</span>
            </div>
            <p className="text-primary-foreground font-bold text-lg">
              -₹{expense.toLocaleString("en-IN")}
            </p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

// ==================== TRANSACTION FORM COMPONENT ====================
function TransactionForm({ onAddTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("expense");
  const [person, setPerson] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if ((category === "lent" || category === "borrowed") && !person.trim()) {
      setError("Please enter the person's name");
      return;
    }

    onAddTransaction({
      title: title.trim(),
      amount: Number(amount),
      uiCategory: category, // income/expense/lent/borrowed mapping
      person: person.trim() || "",
    });

    setTitle("");
    setAmount("");
    setPerson("");
    setCategory("expense");
    setError("");
  };

  const showPersonField = category === "lent" || category === "borrowed";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-3xl shadow-card p-6 space-y-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Receipt className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-bold text-lg text-card-foreground">New Transaction</h3>
      </div>

      <div className="relative">
        <input
          className="w-full bg-secondary rounded-xl p-4 pr-12 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="What is this for? (e.g., Groceries)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
        <input
          type="number"
          min="1"
          className="w-full bg-secondary rounded-xl p-4 pl-8 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = category === cat.value;
          return (
            <motion.button
              key={cat.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                isSelected ? cat.color : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showPersonField && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="w-full bg-primary/5 border-2 border-primary/20 rounded-xl p-4 pl-11 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all"
                placeholder={category === "lent" ? "Lent to whom?" : "Borrowed from whom?"}
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-destructive text-sm font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
      >
        <Plus className="w-5 h-5" />
        Add Transaction
      </motion.button>
    </motion.section>
  );
}

// ==================== TRANSACTION CARD COMPONENT ====================
function TransactionCard({ transaction, onDeleteRequest }) {
  // Translate DB fields to UI visual states
  let visualCategory = "expense";
  if (transaction.borrowStatus === "lent") visualCategory = "lent";
  else if (transaction.borrowStatus === "borrowed") visualCategory = "borrowed";
  else if (transaction.type === "income") visualCategory = "income";

  const isPositive = visualCategory === "income" || visualCategory === "borrowed";
  const config = categoryConfig[visualCategory];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="group bg-card p-4 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Display original database string category here */}
          <p className="font-semibold text-card-foreground truncate">{transaction.category}</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
            {transaction.person && transaction.person !== "-" && (
              <span className="text-xs text-muted-foreground truncate">
                {visualCategory === "lent" ? "to" : "from"} {transaction.person}
              </span>
            )}
          </div>
        </div>

        <div className="text-right flex items-center gap-3">
          <p className={`font-bold text-lg ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : "-"}₹{Number(transaction.amount).toLocaleString("en-IN")}
          </p>
          <button
            onClick={() => onDeleteRequest(transaction.id)}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== DELETE CONFIRM MODAL COMPONENT ====================
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
                <h3 className="font-bold text-lg text-card-foreground">Delete Transaction?</h3>
                <p className="text-muted-foreground text-sm mt-1">This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3.5 rounded-xl font-semibold border border-gray-300 dark:border-gray-700 text-card-foreground hover:bg-secondary transition-colors"
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
const Fund = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docToDelete, setDocToDelete] = useState(null);

  // Theme setup
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Firebase Real-time Listener (Identical to original)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTransactions(data);
      setLoading(false);

      const income = data
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);

      const expense = data
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { funds: income - expense });
    });

    return () => unsubscribe();
  }, []);

  // Calculate Totals using state
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Add Data mapped perfectly to original DB schema
  const handleAddTransaction = async ({ title, amount, uiCategory, person }) => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    let dbType = "expense";
    let dbBorrowStatus = "none";

    // Translating UI selections back to your database logic
    if (uiCategory === "income") {
      dbType = "income";
    } else if (uiCategory === "expense") {
      dbType = "expense";
    } else if (uiCategory === "lent") {
      dbType = "expense"; 
      dbBorrowStatus = "lent";
    } else if (uiCategory === "borrowed") {
      dbType = "income"; 
      dbBorrowStatus = "borrowed";
    }

    await addDoc(collection(db, "users", user.uid, "transactions"), {
      type: dbType,
      amount: Number(amount),
      category: title, // Text description maps to original 'category' field
      borrowStatus: dbBorrowStatus,
      person: person || "",
      createdAt: new Date(),
      date: new Date().toLocaleString(),
    });
  };

  // Delete Data (Identical to original)
  const handleDelete = async () => {
    if (!docToDelete) return;
    const user = auth.currentUser;
    await deleteDoc(doc(db, "users", user.uid, "transactions", docToDelete));
    setDocToDelete(null);
  };

  // Group transactions by Date for the UI
  const groupedTransactions = useMemo(() => {
    const groups = {};
    transactions.forEach((t) => {
      // Safely handle both string dates and Firestore timestamps
      let dateString = "Unknown Date";
      if (t.createdAt?.toDate) {
        dateString = t.createdAt.toDate().toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        });
      } else if (t.date) {
        dateString = t.date.split(',')[0]; // Quick fallback for older entries
      }
      
      if (!groups[dateString]) groups[dateString] = [];
      groups[dateString].push(t);
    });
    return Object.entries(groups);
  }, [transactions]);

  if (loading) return <div className="p-6 text-center text-muted-foreground min-h-screen bg-background">Loading Tracker...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <BalanceHeader
        balance={balance}
        income={totalIncome}
        expense={totalExpense}
        isDark={darkMode}
        onThemeToggle={() => setDarkMode(!darkMode)}
      />

      <main className="max-w-md mx-auto px-4 -mt-4">
        <TransactionForm onAddTransaction={handleAddTransaction} />

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <History className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Recent Transactions</h3>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {groupedTransactions.map(([date, items]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h4 className="text-sm font-medium text-muted-foreground px-1">{date}</h4>
                  <div className="space-y-3">
                    {items.map((t) => (
                      <TransactionCard key={t.id} transaction={t} onDeleteRequest={setDocToDelete} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {transactions.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">No transactions yet.</p>
              <p className="text-sm text-muted-foreground/60">Add your first transaction above</p>
            </motion.div>
          )}
        </motion.section>
      </main>

      <DeleteConfirmModal 
        isOpen={!!docToDelete} 
        onConfirm={handleDelete} 
        onCancel={() => setDocToDelete(null)} 
      />
    </div>
  );
};

export default Fund;