import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Leaf, Sprout, Cloud, ChartAreaIcon, Brain } from "lucide-react";
import { FaBriefcaseMedical } from "react-icons/fa";

// todo : make this layout responsive
const FeaturesPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="max-w-80 flex-shrink-0 bg-mycol-dartmouth_green text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Smart Farming</h2>
          <nav className="space-y-2">
            <NavLink
              to="/features"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-green-500/20 border border-green-500/30"
                  : "hover:bg-green-500/20"
                }`
              }
            >
              <Leaf className="w-5 h-5" />
              <span>Disease Detection</span>
            </NavLink>
            <NavLink
              to="/features/soil"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-green-500/20 border border-green-500/30"
                  : "hover:bg-green-500/20"
                }`
              }
            >
              <Sprout className="w-5 h-5" />
              <span>Soil Analysis</span>
            </NavLink>
            <NavLink
              to="/features/weather"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-green-500/20 border border-green-500/30"
                  : "hover:bg-green-500/20"
                }`
              }
            >
              <Cloud className="w-5 h-5" />
              <span>crop video analysis</span>
            </NavLink>
            <NavLink
              to="/features/crop-recommendation"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-green-500/20 border border-green-500/30"
                  : "hover:bg-green-500/20"
                }`
              }
            >
              <Leaf className="w-5 h-5" />
              <span>Crop Recommendation</span>
            </NavLink>

            <NavLink
              to="/features/fertilizer-recommendation"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-green-500/20 border border-green-500/30"
                  : "hover:bg-green-500/20"
                }`
              }
            >
              <Leaf className="w-5 h-5" />
              <span>Fertilizer Recommendation</span>
            </NavLink>
            <NavLink
              to="/features/general-expert"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-green-500/20 border border-green-500/30"
                  : "hover:bg-green-500/20"
                }`
              }
            >
              <Brain className="w-5 h-5" />
              <span>AI-Expert</span>
            </NavLink>

            <NavLink
              to="/features/disease-expert"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-green-500/20 border border-green-500/30"
                  : "hover:bg-green-500/20"
                }`
              }
            >
              <FaBriefcaseMedical className="w-5 h-5" />
              <span>Disease AI-Expert </span>
            </NavLink>
          </nav>
        </div>
      </div>
      {/* {crop - recommendation} */}

      {/* Main Content */}
      <div className="flex-1 ">
        <div className="max-w-8xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
