import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

// Function to determine color based on percentage
const getColorForPercentage = (percent) => {
  const hue = (percent * 120) / 100; // 0=red → 120=green
  return `hsl(${hue}, 100%, 45%)`;
};

const HabitProgressChart = ({ habits }) => {
  const chartData = useMemo(() => {
    if (!habits || habits.length === 0) return [];

    return habits.map((habit) => {
      const days = Array.isArray(habit.days) ? habit.days : [];
      const doneCount = days.filter((d) => d === true).length;
      const percent = Math.round((doneCount / 7) * 100);
      return { name: habit.name, progress: percent };
    });
  }, [habits]);

  if (!chartData.length) {
    return (
      <div className="text-center text-gray-500 py-6">
        No progress yet. Mark some habits as done!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-xl font-semibold mb-3 text-center">
        📊 Weekly Habit Progress
      </h3>
      <div className="w-full h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={[...chartData]}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
            <Tooltip formatter={(val) => `${val}%`} />
            <Bar dataKey="progress" barSize={40}>
              <LabelList dataKey="progress" position="top" formatter={(v) => `${v}%`} />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColorForPercentage(entry.progress)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HabitProgressChart;
