import React, { useState } from "react";
import { User, Lock } from "lucide-react"; // Changed Mail to User for username
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "ກະລຸນາປ້ອນຊື່ບັນຊີ";
    if (!formData.password.trim()) newErrors.password = "ກະລຸນາປ້ອນລະຫັດຜ່ານ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/loginAdmin", formData);
      const { user } = response.data;

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify({
        emp_id: user.emp_id,
        username: user.username,
        role: user.role,
      }));

      Toast.fire({
        icon: "success",
        title: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
      });

      // Navigate to home page after a short delay to show Toast
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ:", error);
      Toast.fire({
        icon: "error",
        title: error.response?.data?.msg || "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundColor: "#81C784", // Green background
      }}
    >
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 sm:p-12 w-full max-w-md sm:max-w-xl">
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/188/188864.png"
            alt="Football Icon"
            className="w-24 h-24"
          />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-green-700 mb-8 font-noto-sans-lao">
          ເຂົ້າສູ່ລະບົບ NATHOM
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-md px-4 py-3">
            <User className="text-gray-500 mr-3" size={24} />
            <input
              className="w-full bg-transparent focus:ring-0 focus:outline-none text-lg font-noto-sans-lao"
              name="username"
              type="text"
              placeholder="ຊື່ບັນຊີ"
              value={formData.username}
              onChange={handleChange}
              required
              aria-label="ຊື່ບັນຊີ"
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.username}</p>
          )}

          <div className="flex items-center border border-gray-300 rounded-md px-4 py-3">
            <Lock className="text-gray-500 mr-3" size={24} />
            <input
              className="w-full bg-transparent focus:ring-0 focus:outline-none text-lg font-noto-sans-lao"
              name="password"
              type="password"
              placeholder="ລະຫັດຜ່ານ"
              value={formData.password}
              onChange={handleChange}
              required
              aria-label="ລະຫັດຜ່ານ"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.password}</p>
          )}

          <button
            className="w-full bg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition duration-300 text-lg font-noto-sans-lao"
            type="submit"
            disabled={loading}
            aria-label="ເຂົ້າສູ່ລະບົບ"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                ກຳລັງໂຫຼດ...
              </span>
            ) : (
              "ເຂົ້າສູ່ລະບົບ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;