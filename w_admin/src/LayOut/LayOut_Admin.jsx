import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Landmark,
  Pizza,
  LogOut,
  Menu,
  ArrowLeft,
  UserCog,
} from "lucide-react";
import Swal from "sweetalert2";

const LayOut_Admin = () => {
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

  // Check authentication and role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      Toast.fire({
        icon: "error",
        title: "ກະລຸນາເຂົ້າສູ່ລະຬົບ",
      });
      navigate("/");
    } else if (user.role !== "admin" && user.role !== "manager") {
      Toast.fire({
        icon: "error",
        title: "ທ່ານບໍ່ມີສິດທິເຂົ້າເຖິງໜ້ານີ້",
      });
      navigate("/home");
    } else if (user.role === "admin" && window.location.pathname === "/admin") {
      // Redirect admin users away from /admin route
      Toast.fire({
        icon: "error",
        title: "ທ່ານບໍ່ສາມາດເຂົ້າເຖິງການຈັດການພະນັກງານໄດ້",
      });
      navigate("/admin/booking"); // Redirect to another allowed route
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
        title: "ອອກຈາກາະຬົບສຳເາັດ",
      });
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};
console.log(user);
  return (
    <div className="flex min-h-screen bg-green-800">
      {/* Sidebar */}
      <div
        className={`bg-green-900 w-64 flex flex-col text-white shadow-lg transform transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 fixed md:static h-full z-50`}
      >
        {/* Header Sidebar */}
        <div className="h-16 bg-green-700 flex items-center justify-center text-xl font-semibold tracking-wide font-noto-sans-lao">
          ກະດານຈັດການຂໍ້ມູນ
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-3">
          {user.role === "manager" && (
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all font-noto-sans-lao ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-200 hover:bg-green-700 hover:text-white"
                }`
              }
              aria-label="ຈັດການຂໍ້ມູນພັະນັກງານ"
            >
              <UserCog className="w-5 h-5 mr-3" />
              ຂໍ້ມູນພັະນັກງານ
            </NavLink>
          )}

          <NavLink
            to="booking"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all font-noto-sans-lao ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-200 hover:bg-green-700 hover:text-white"
              }`
            }
            aria-label="ຈັດການຂໍ້ມູນການຈອງ"
          >
            <Package className="w-5 h-5 mr-3" />
            ຂໍ້ມູນການຈອງ
          </NavLink>

          <NavLink
            to="stadil"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all font-noto-sans-lao ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-200 hover:bg-green-700 hover:text-white"
              }`
            }
            aria-label="ຈັດການຂໍ້ຮູນເດີ່ນບານ"
          >
            <Landmark className="w-5 h-5 mr-3" />
            ຂໍ້ມູນເດີ່ນບານ
          </NavLink>

          <NavLink
            to="product"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all font-noto-sans-lao ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-200 hover:bg-green-700 hover:text-white"
              }`
            }
            aria-label="ຈັດການຂໍ້ມູນສິນຄ້າ"
          >
            <Pizza className="w-5 h-5 mr-3" />
            ຂໍ້ມູນສິນຄ້າ
          </NavLink>
        </nav>

        {/* Footer (Back and Logout Buttons) */}
        <div className="p-4 space-y-3">
          <button
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all font-noto-sans-lao"
            onClick={() => navigate("/home")}
            aria-label="ຍ້ອນກັຬໜ້າຫຼັກ"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ຍ້ອນກັຬໜ້າຫຼັກ
          </button>
        
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white h-16 shadow-md flex items-center justify-between px-4 sm:px-6 text-lg font-semibold border-b-2 border-green-600 font-noto-sans-lao">
          <button
            className="text-gray-600 hover:text-gray-900 transition md:hidden"
            onClick={toggleSidebar}
            aria-label="ເປີດ/ປິດແຖຬຂ້າງ"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span>ແຜງໜ້າປັດຈັດການຂໍ້ມູນ</span>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-6 bg-green-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayOut_Admin;