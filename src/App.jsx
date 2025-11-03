import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import HabitPage from "./components/HabitPage";
import Fund from "./components/fund";
import Stocks from "./components/stocks";
import Documents from "./components/documents";
import DailyTask from "./components/dailytask";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />

        {/* ✅ Only logged-in users can access these */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HabitPage"
          element={
            <ProtectedRoute>
              <HabitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fund"
          element={
            <ProtectedRoute>
              <Fund />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stocks"
          element={
            <ProtectedRoute>
              <Stocks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dailytask"
          element={
            <ProtectedRoute>
              <DailyTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
