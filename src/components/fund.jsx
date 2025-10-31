import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import { db, auth } from "../firebase";

const Fund = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    category: "",
    person: "",
    borrowStatus: "none",
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ["#22c55e", "#ef4444"];

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(data);
      setLoading(false);

      const income = data
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const expense = data
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const balance = income - expense;

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { funds: balance });
      } catch (err) {
        console.error("Error updating user funds:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    const newTransaction = {
      ...formData,
      amount: Number(formData.amount),
      createdAt: new Date(),
      date: new Date().toLocaleString(),
    };

    try {
      await addDoc(
        collection(db, "users", user.uid, "transactions"),
        newTransaction
      );
      setFormData({
        type: "income",
        amount: "",
        category: "",
        person: "",
        borrowStatus: "none",
      });
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    try {
      await deleteDoc(doc(db, "users", user.uid, "transactions", id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const data = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  if (loading)
    return <div className="p-8 text-center">Loading transactions...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md flex flex-col h-screen w-full overflow-hidden">
        {/* Fixed Header + Summary + Form */}
        <div className="p-4 md:p-6 border-b bg-white sticky top-0 z-20">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-3">
            💰 Money Management System
          </h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4 text-center">
            <div className="bg-green-100 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Income</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">
                ₹{totalIncome}
              </p>
            </div>
            <div className="bg-red-100 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Expense</p>
              <p className="text-lg md:text-2xl font-bold text-red-500">
                ₹{totalExpense}
              </p>
            </div>
            <div className="bg-blue-100 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">Balance</p>
              <p className="text-lg md:text-2xl font-bold text-blue-600">
                ₹{balance}
              </p>
            </div>
          </div>

          {/* Add Transaction Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-3 items-center"
          >
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="border px-2 py-2 rounded-md w-full md:w-auto text-sm"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="border px-2 py-2 rounded-md flex-1 text-sm"
            />

            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border px-2 py-2 rounded-md flex-1 text-sm"
            />

            <select
              value={formData.borrowStatus}
              onChange={(e) =>
                setFormData({ ...formData, borrowStatus: e.target.value })
              }
              className="border px-2 py-2 rounded-md w-full md:w-auto text-sm"
            >
              <option value="none">Normal</option>
              <option value="lent">Lent (Given)</option>
              <option value="borrowed">Borrowed (Taken)</option>
            </select>

            {formData.borrowStatus !== "none" && (
              <input
                type="text"
                placeholder="Person's Name"
                value={formData.person}
                onChange={(e) =>
                  setFormData({ ...formData, person: e.target.value })
                }
                className="border px-2 py-2 rounded-md flex-1 text-sm"
              />
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full md:w-auto text-sm"
            >
              Add
            </button>
          </form>
        </div>
        <h3 className="font-semibold text-lg mb-3 sticky top-0 bg-white z-10">
          Recent Transactions
        </h3>
        {/* Scrollable Transaction List */}
        <div className="flex-1 overflow-y-auto p-4">

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center ">
              No transactions yet. Add one above.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs md:text-sm text-left">
                <thead className="bg-gray-50 border-b sticky top-0 z-20">
                  <tr>
                    <th className="px-2 py-2">Category</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">Amount</th>
                    <th className="px-2 py-2">Borrow/Lent</th>
                    <th className="px-2 py-2">Person</th>
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-2 py-2 font-medium">{t.category}</td>
                      <td className="px-2 py-2">
                        {t.type === "income" ? (
                          <span className="text-green-600 font-semibold">
                            Income
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">
                            Expense
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2">₹{t.amount}</td>
                      <td className="px-2 py-2 capitalize">
                        {t.borrowStatus === "none"
                          ? "-"
                          : t.borrowStatus === "lent"
                            ? "Lent"
                            : "Borrowed"}
                      </td>
                      <td className="px-2 py-2">{t.person || "-"}</td>
                      <td className="px-2 py-2 text-gray-600 truncate">
                        {t.date}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Fixed Pie Chart at Bottom */}
        {/* <div className="h-56 md:h-64 bg-white border-t p-2 md:p-4 sticky bottom-0 z-10">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  );
};

export default Fund;
