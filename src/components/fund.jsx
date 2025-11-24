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
  const [docToDelete, setDocToDelete] = useState(null);

  const COLORS = ["#22c55e", "#ef4444"];

  // calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // fetch transactions
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

  // add
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) return;

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    await addDoc(collection(db, "users", user.uid, "transactions"), {
      ...formData,
      amount: Number(formData.amount),
      createdAt: new Date(),
      date: new Date().toLocaleString(),
    });

    setFormData({
      type: "income",
      amount: "",
      category: "",
      person: "",
      borrowStatus: "none",
    });
  };

  // delete
  const handleDelete = async () => {
    const user = auth.currentUser;
    await deleteDoc(doc(db, "users", user.uid, "transactions", docToDelete));
    setDocToDelete(null);
  };

  const data = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <>
      {/* DELETE MODAL */}
      {docToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-300 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Transaction?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* HEADER CARD */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              💰 Money Manager
            </h2>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-3 gap-3 mt-5">

              <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700">
                <p className="text-xs text-gray-700 dark:text-gray-300">Income</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  ₹{totalIncome}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700">
                <p className="text-xs text-gray-700 dark:text-gray-300">Expense</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-300">
                  ₹{totalExpense}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700">
                <p className="text-xs text-gray-700 dark:text-gray-300">Balance</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-300">
                  ₹{balance}
                </p>
              </div>
            </div>

            {/* CHART */}
            <div className="w-full h-56 mt-6">
              {transactions.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No transactions yet.
              </p>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} dataKey="value" outerRadius={70} label>
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-6"
            >
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <input
                type="number"
                placeholder="Amount"
                className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />

              <input
                type="text"
                placeholder="Category"
                className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />

              <select
                value={formData.borrowStatus}
                onChange={(e) =>
                  setFormData({ ...formData, borrowStatus: e.target.value })
                }
                className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              >
                <option value="none">Normal</option>
                <option value="lent">Lent</option>
                <option value="borrowed">Borrowed</option>
              </select>

              {formData.borrowStatus !== "none" && (
                <input
                  type="text"
                  placeholder="Person Name"
                  className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  value={formData.person}
                  onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                />
              )}

              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2">
                Add
              </button>
            </form>
          </div>

          {/* TABLE */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Recent Transactions
            </h3>

            {transactions.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No transactions yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <tr>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Person</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <td className="p-2 text-gray-900 dark:text-gray-100">
                          {t.category}
                        </td>

                        <td className="p-2">
                          {t.type === "income" ? (
                            <span className="text-green-600 dark:text-green-300 font-semibold">
                              Income
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-300 font-semibold">
                              Expense
                            </span>
                          )}
                        </td>

                        <td className="p-2 text-gray-900 dark:text-gray-100">
                          ₹{t.amount}
                        </td>

                        <td className="p-2 capitalize text-gray-800 dark:text-gray-200">
                          {t.borrowStatus}
                        </td>

                        <td className="p-2 text-gray-800 dark:text-gray-200">
                          {t.person || "-"}
                        </td>

                        <td className="p-2 text-gray-700 dark:text-gray-300">
                          {t.date}
                        </td>

                        <td className="p-2 text-right">
                          <button
                            onClick={() => setDocToDelete(t.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
        </div>
      </div>
    </>
  );
};

export default Fund;
