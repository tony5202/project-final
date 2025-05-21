import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Landmark,
  Pizza,
  ClipboardList,
  LogOut,
  Menu,
  ArrowLeft,
  User,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import Swal from "sweetalert2";

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  // Check authentication and restrict admin access
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      Toast.fire({
        icon: "error",
        title: "ກະລຸນາເຂົ້າສູ່ລະຬົບ",
      });
      navigate("/login");
    } else if (
      user.role === "admin" &&
      (window.location.pathname === "/report/expenditure" ||
        window.location.pathname === "/report/income")
    ) {
      Toast.fire({
        icon: "error",
        title: "ທ່ານບໍ່ສາມາດເຂົ້າເຖິງລາຍງານນີ້ໄດ້",
      });
      navigate("/report"); // Redirect to the default report route
    }
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ທ່ານຕ້ອງການອອກຈາກລະຬົບບໍ່?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ອອກຈາກລະຬົບ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("user");
      Toast.fire({
        icon: "success",
        title: "ອອກຈາກລະຬົບສຳເລັດ",
      });
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-green-900 to-green-700 text-white w-64 sm:w-80 flex flex-col transition-all duration-300 shadow-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-80"
        } md:translate-x-0 fixed md:static h-full rounded-r-xl z-50`}
      >
        {/* Sidebar Header */}
        <div className="h-20 bg-green-800 flex items-center justify-center text-2xl font-bold tracking-wide border-b border-green-600 shadow-md font-noto-sans-lao">
          ກະດານລາຍງານ
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 sm:px-6 py-6 space-y-3">
          <NavLink
            to="/report"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg transition-all font-noto-sans-lao ${
                isActive ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"
              }`
            }
            aria-label="ລາຍງານຜູ້ໃຊ້"
          >
            <User className="w-6 h-6" />
            ລາຍງານຜູ້ໃຊ້
          </NavLink>

          {user.role === "manager" && (
            <>
              {/* <NavLink
                to="expenditure"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3 rounded-lg transition-all font-noto-sans-lao ${
                    isActive ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"
                  }`
                }
                aria-label="ລາຍງານລາຍຈ່າຍ"
              >
                <Package className="w-6 h-6" />
                ລາຍງານລາຍຈ່າຍ
              </NavLink> */}

              <NavLink
                to="income"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-3 rounded-lg transition-all font-noto-sans-lao ${
                    isActive ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"
                  }`
                }
                aria-label="ລາຍງານລາຍຮັບ"
              >
                <TrendingUp className="w-6 h-6" />
                ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ
              </NavLink>
            </>
          )}

          <NavLink
            to="product"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg transition-all font-noto-sans-lao ${
                isActive ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"
              }`
            }
            aria-label="ລາຍງານສິນຄ້າ"
          >
            <Pizza className="w-6 h-6" />
            ລາຍງານສິນຄ້າ
          </NavLink>

          <NavLink
            to="booking"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg transition-all font-noto-sans-lao ${
                isActive ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"
              }`
            }
            aria-label="ລາຍງານການຈອງ"
          >
            <ClipboardList className="w-6 h-6" />
            ລາຍງານການຈອງ
          </NavLink>

          <NavLink
            to="checkin"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg transition-all font-noto-sans-lao ${
                isActive ? "bg-green-600 text-white" : "hover:bg-green-600 hover:text-white"
              }`
            }
            aria-label="ລາຍງານແຈ້ງເຂົ້າ"
          >
            <BarChart2 className="w-6 h-6" />
            ລາຍງານແຈ້ງເຂົ້າ
          </NavLink>
        </nav>

        {/* Logout & Return Buttons */}
        <div className="p-4 sm:p-6 space-y-3">
          <button
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-md transition-all font-noto-sans-lao"
            onClick={() => navigate("/home")}
            aria-label="ຍ້ອນກັຬໜ້າຫຼັກ"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            ຍ້ອນກັຬໜ້າຫຼັກ
          </button>
        
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white h-20 shadow-lg flex items-center justify-between px-4 sm:px-8 text-xl font-semibold border-b-2 border-green-600 rounded-b-xl font-noto-sans-lao">
          <button
            className="text-gray-600 hover:text-gray-900 transition md:hidden"
            onClick={toggleSidebar}
            aria-label="ເປີດ/ປິດແຖຬຂ້າງ"
          >
            <Menu className="w-7 h-7" />
          </button>
          <span>ແຜງໜ້າປັດລາຍງານ</span>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-8 bg-white shadow-md rounded-lg overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Reports;