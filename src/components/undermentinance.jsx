import React from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Clock } from "lucide-react";

const UnderMaintenance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4 transition-colors duration-300">
      {/* Icon Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-full p-6 mb-6 transition-colors duration-300">
        <Wrench className="w-16 h-16 text-yellow-500 animate-spin-slow" />
      </div>

      {/* Text Section */}
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
        We're Under Maintenance
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        Our team is currently upgrading the{" "}
        features.
        It’ll be back soon with real-time data and performance insights!
      </p>

      {/* Time estimate + back button */}
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Clock className="w-4 h-4 mr-1" /> coming soon
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all duration-300"
        >
          Go Back to Dashboard
        </button>
        
      </div>
    </div>
  );
};

export default UnderMaintenance;
