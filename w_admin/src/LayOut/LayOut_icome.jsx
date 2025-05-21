import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HandCoins,
  LogOut,
  Menu,
  ArrowLeft,
  Store,
} from "lucide-react";

const LayOut_icome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-green-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
 

        {/* Tab Navigation */}
        <nav className="bg-white shadow-md px-8 py-4 border-b border-green-200 flex space-x-6 text-base font-medium">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-100"
              }`
            }
          >
            <Store className="w-5 h-5" />
          ລາຍຮັບຈາກການຂາຍ
          </NavLink>

          <NavLink
            to="income_stadium"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-100"
              }`
            }
          >
            <HandCoins className="w-5 h-5" />
            ລາຍຮັບຈາກເດີ່ນ
          </NavLink>

          <NavLink
            to="expenditure"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive
                  ? "bg-red-500 text-white"
                  : "text-gray-700 hover:bg-green-100"
              }`
            }
          >
            <HandCoins className="w-5 h-5" />
            ລາຍຈ່າຍ
          </NavLink>
        </nav>

        {/* Main Section */}
        <main className="flex-1 p-8 bg-white shadow-inner rounded-lg overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayOut_icome;
