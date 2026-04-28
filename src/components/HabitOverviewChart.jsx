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

// Get week number from Date object
const getWeekNumber = (d) => {
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const pastDays = Math.floor((d - firstDay) / 86400000);
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

const HabitOverviewChart = ({ habits = [] }) => {
  const [view, setView] = useState("daily"); // daily | weekly | monthly

  const data = useMemo(() => {
    if (!habits.length) return [];

    const grouped = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day for accurate comparison

    habits.forEach((habit) => {
      // Safety check: requires the new monthly structure
      if (!habit.days || !Array.isArray(habit.days) || !habit.month) return;

      // Extract year and month from the habit's "YYYY-MM-DD" base date
      const [yearStr, monthStr] = habit.month.split("-");
      const year = parseInt(yearStr, 10);
      const monthIndex = parseInt(monthStr, 10) - 1; // 0-indexed for JS Date

      habit.days.forEach((done, idx) => {
        // Calculate the exact date this array slot represents
        const currentDayDate = new Date(year, monthIndex, idx + 1);

        // DO NOT calculate stats for days in the future
        if (currentDayDate > today) return;

        // Format dates safely
        const dateStr = `${String(idx + 1).padStart(2, "0")}`;
        const week = getWeekNumber(currentDayDate);
        const monthKey = `${yearStr}-${monthStr}`;

        // Determine grouping key based on user selection
        let key = dateStr;
        if (view === "weekly") key = `${yearStr}-W${week}`;
        else if (view === "monthly") key = monthKey;

        // Tally totals and completions
        if (!grouped[key]) grouped[key] = { key, total: 0, completed: 0 };
        grouped[key].total++;
        if (done) grouped[key].completed++;
      });
    });

    const sortedData = Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));

    return sortedData.map((d) => ({
      label: d.key,
      percent: Math.round((d.completed / d.total) * 100) || 0,
    }));
  }, [habits, view]);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-gray-100 p-4 rounded-xl shadow-md mt-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📈 Overall Habit Progress</h2>

        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border p-1 rounded-md text-sm bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
          No past data to show progress yet. Complete some habits today!
        </p>
      ) : (
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          {/* Ensure a min-width so daily bars don't squish too much on a 31-day month */}
          <div style={{ minWidth: view === "daily" && data.length > 14 ? "800px" : "100%" }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                <XAxis
                  dataKey="label"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="currentColor"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="currentColor"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "currentColor", opacity: 0.05 }}
                  contentStyle={{
                    backgroundColor: "var(--tw-prose-bg, #1f2937)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [`${value}%`, "Completed"]}
                  labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
                />
                <Bar dataKey="percent" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorForPercentage(entry.percent)} />
                  ))}
                  <LabelList 
                    dataKey="percent" 
                    position="top" 
                    formatter={(v) => `${v}%`} 
                    style={{ fill: "currentColor", fontSize: 10, fontWeight: 600 }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitOverviewChart;