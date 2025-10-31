import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

// Convert % → color
const getColorForPercentage = (percent) => {
  const p = Math.min(Math.max(percent, 0), 100);
  const hue = (p * 120) / 100; // red → green
  return `hsl(${hue}, 100%, 45%)`;
};

// Helper: Get week number from a date
const getWeekNumber = (dateStr) => {
  const d = new Date(dateStr);
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const pastDays = Math.floor((d - firstDay) / 86400000);
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

const HabitProgressChart = ({ habits = [] }) => {
  const [view, setView] = useState("daily"); // daily | weekly | monthly

  // 🧠 Process data based on view
  const data = useMemo(() => {
    if (!habits.length) return [];

    const grouped = {};

    habits.forEach((h) => {
      const date = h.date || "Unknown";
      const d = new Date(date);

      let key = date;
      if (view === "weekly") {
        const week = getWeekNumber(date);
        key = `${d.getFullYear()}-W${week}`;
      } else if (view === "monthly") {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }

      if (!grouped[key]) grouped[key] = { key, total: 0, completed: 0 };
      grouped[key].total++;
      if (h.completed) grouped[key].completed++;
    });

    return Object.values(grouped).map((d) => ({
      label: d.key,
      percent: Math.round((d.completed / d.total) * 100),
    }));
  }, [habits, view]);

  if (data.length === 0)
    return <p className="text-center text-gray-500">No data yet to show progress.</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📊 Habit Completion Progress</h2>

        {/* View Selector */}
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border p-1 rounded-md text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value) => `${value}%`} labelFormatter={(label) => `Period: ${label}`} />
          <Bar dataKey="percent" barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForPercentage(entry.percent)} />
            ))}
            <LabelList dataKey="percent" position="top" formatter={(v) => `${v}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HabitProgressChart;
