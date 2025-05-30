import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FolderKanban, CircleArrowDown, MapPinCheck, Store, LogOut, BookDown } from "lucide-react";
import Swal from "sweetalert2";

const Dashboard = () => {
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

  // Check authentication
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      Toast.fire({
        icon: "error",
        title: "ກະລຸນາເຂົ້າສູ່ລະບົບ",
      });
      navigate("/");
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
      navigate("/");
    }
  };

  // Get user data
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const displayName = user.name || user.username || "ຜູ້ໃຊ້";
  const displayRole = user.role === "admin" ? "ພະນັກງານ" : user.role === "manager" ? "ຜູ້ຈັດການ" : user.role || "ບໍ່ລະບຸ";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-500 px-4 sm:px-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 text-center font-noto-sans-lao">
        ແຜງໜ້າປັດ NATHOM
      </h1>

      {/* User Account Details */}
      <div className="w-full max-w-4xl mb-6 sm:mb-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
        <p className="text-lg sm:text-xl font-semibold text-green-700 font-noto-sans-lao">
          ຍິນດີຕ້ອນຮັບ, {displayName}
        </p>
        <p className="text-sm sm:text-base text-gray-600 font-noto-sans-lao">
          ຊື່ຜູ້ໃຊ້: @{user.username || "ບໍ່ລະບຸ"}
        </p>
       
        <p className="text-sm sm:text-base text-gray-600 font-noto-sans-lao">
          ບົດບາດ: {displayRole}
        </p>
       
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
        {/* Admin Navigation Link */}
        <NavLink
          to="/admin"
          className="flex items-center justify-center px-6 py-5 sm:px-10 sm:py-6 rounded-xl bg-white text-gray-800 shadow-2xl 
          hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 text-xl sm:text-2xl"
          aria-label="ຈັດການຂໍ້ມູນພຶ້ນຖານ"
        >
          <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-green-600 hover:text-white transition-colors duration-300" />
          <span className="font-semibold text-center font-noto-sans-lao">ຈັດການຂໍ້ມູນ</span>
        </NavLink>

        {/* Check In Navigation Link */}
        <NavLink
          to="/checkin"
          className="flex items-center justify-center px-6 py-5 sm:px-10 sm:py-6 rounded-xl bg-white text-gray-800 shadow-2xl 
          hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 text-xl sm:text-2xl"
          aria-label="ແຈ້ງເຂົ້າ"
        >
          <MapPinCheck className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-green-600 hover:text-white transition-colors duration-300" />
          <span className="font-semibold text-center font-noto-sans-lao">ແຈ້ງເຂົ້າ</span>
        </NavLink>

        {/* Report Navigation Link */}
        <NavLink
          to="/report"
          className="flex items-center justify-center px-6 py-5 sm:px-10 sm:py-6 rounded-xl bg-white text-gray-800 shadow-2xl 
          hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 text-xl sm:text-2xl"
          aria-label="ລາຍງານ"
        >
          <CircleArrowDown className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-green-600 hover:text-white transition-colors duration-300" />
          <span className="font-semibold text-center font-noto-sans-lao">ລາຍງານ</span>
        </NavLink>

        {/* Sale Navigation Link */}
        <NavLink
          to="/sale"
          className="flex items-center justify-center px-6 py-5 sm:px-10 sm:py-6 rounded-xl bg-white text-gray-800 shadow-2xl 
          hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 text-xl sm:text-2xl"
          aria-label="ຂາຍສິນຄ້າ"
        >
          <Store className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-green-600 hover:text-white transition-colors duration-300" />
          <span className="font-semibold text-center font-noto-sans-lao">ຂາຍສິນຄ້າ</span>
        </NavLink>

        {/* Expenses Navigation Link */}
        <NavLink
          to="/expen"
          className="flex items-center justify-center px-6 py-5 sm:px-10 sm:py-6 rounded-xl bg-white text-gray-800 shadow-2xl 
          hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 text-xl sm:text-2xl"
          aria-label="ບັນທຶກລາຍຈ່າຍ"
        >
          <BookDown className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-green-600 hover:text-white transition-colors duration-300" />
          <span className="font-semibold text-center font-noto-sans-lao">ບັນທຶກລາຍຈ່າຍ</span>
        </NavLink>

        {/* Logout Navigation Link */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-6 py-5 sm:px-10 sm:py-6 rounded-xl bg-white text-gray-800 shadow-2xl 
          hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 text-xl sm:text-2xl"
          aria-label="ອອກຈາກລະຬົບ"
        >
          <LogOut className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-red-600 hover:text-white transition-colors duration-300" />
          <span className="font-semibold text-center font-noto-sans-lao">ອອກຈາກລະຬົບ</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;