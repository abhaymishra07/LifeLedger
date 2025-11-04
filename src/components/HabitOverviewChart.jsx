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

// Convert % → color (red → green)
const getColorForPercentage = (percent) => {
  const p = Math.min(Math.max(percent, 0), 100);
  const hue = (p * 120) / 100; // 0 = red, 120 = green
  return `hsl(${hue}, 100%, 45%)`;
};

// Get week number from date
const getWeekNumber = (dateStr) => {
  const d = new Date(dateStr);
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const pastDays = Math.floor((d - firstDay) / 86400000);
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

const HabitOverviewChart = ({ habits = [] }) => {
  const [view, setView] = useState("daily"); // daily | weekly | monthly

  const data = useMemo(() => {
    if (!habits.length) return [];

    const grouped = {};

    habits.forEach((habit) => {
      if (!habit.days || !Array.isArray(habit.days)) return;

      habit.days.forEach((done, idx) => {
        const d = new Date();
        const date = new Date();
        date.setDate(d.getDate() - (6 - idx)); // last 7 days
        const dateStr = date.toISOString().split("T")[0];
        const week = getWeekNumber(dateStr);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        let key = dateStr;
        if (view === "weekly") key = `${date.getFullYear()}-W${week}`;
        else if (view === "monthly") key = month;

        if (!grouped[key]) grouped[key] = { key, total: 0, completed: 0 };
        grouped[key].total++;
        if (done) grouped[key].completed++;
      });
    });

    const sortedData = Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));

    return sortedData.map((d) => ({
      label: d.key,
      percent: Math.round((d.completed / d.total) * 100),
    }));
  }, [habits, view]);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-4 rounded-xl shadow-md mt-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📈 Overall Habit Progress</h2>

        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border p-1 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No data yet to show progress.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="currentColor"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              stroke="currentColor"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tw-prose-bg, #1f2937)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => `${value}%`}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="percent" barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorForPercentage(entry.percent)} />
              ))}
              <LabelList dataKey="percent" position="top" formatter={(v) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HabitOverviewChart;
