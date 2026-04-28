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
import LandingPage from "./components/landingpage";
import Goals from "./components/goals";
import SuggestionPage from "./components/suggestionPage";
import Terms from "./components/terms";
import CookiePolicy from "./components/CookiePolicy";
import CookieConsent from "./components/CookieConsent";
import ForgotPassword from "./components/ForgotPassword";

import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "./hooks/useDarkMode"; 

function App() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    // Wrap everything in a React Fragment to avoid adjacent JSX element errors
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />

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
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggestionPage"
            element={
              <ProtectedRoute>
                <SuggestionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </Router>
      
      <CookieConsent />
    </>
  );
}

export default App;