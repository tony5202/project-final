import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HandCoins,
  BadgeEuro,
  LogOut,
  Menu,
  ArrowLeft,
  Store,
} from "lucide-react";

const Sela = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-green-50">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-green-900 to-green-700 w-72 flex flex-col text-white shadow-2xl transform transition-all duration-500 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-72"
        } md:translate-x-0 fixed md:relative h-full rounded-r-2xl`}
      >
        {/* Header Sidebar */}
        <div className="h-20 bg-green-800 flex items-center justify-center text-2xl font-bold tracking-wide shadow-md border-b border-green-600">
          🏆 Sales & Payment
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-6 space-y-3">
          <NavLink
            to="/sale"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg transition-all ${
                isActive ? "bg-green-600 text-white" : "hover:bg-green-800"
              }`
            }
          >
            <Store className="w-6 h-6" />
            Sales Report
          </NavLink>

          <NavLink
            to="playment"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg transition-all ${
                isActive ? "bg-green-600 text-white" : "hover:bg-green-800"
              }`
            }
          >
            <HandCoins className="w-6 h-6" />
            Payments
          </NavLink>
        </nav>

        {/* Footer (Logout & Return) */}
        <div className="p-6 space-y-3">
          <button
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-md transition-all"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Return to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white h-20 shadow-lg flex items-center justify-between px-8 text-xl font-semibold border-b-2 border-green-600 rounded-b-2xl">
          <button
            className="text-gray-600 hover:text-gray-900 transition md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="w-7 h-7" />
          </button>
          <span>📊 Sales & Payment Dashboard</span>
          <button className="flex items-center bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg shadow-md transition-all">
            <LogOut className="w-6 h-6 mr-2" />
            Logout
          </button>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-8 bg-white shadow-md rounded-lg overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Sela;
