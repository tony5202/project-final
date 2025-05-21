import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    bd: '',
    role: 'admin'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'ກະລຸນາປ້ອນຊື່';
    if (!formData.phone.trim() || !/^\d{8,}$/.test(formData.phone)) newErrors.phone = 'ກະລຸນາປ້ອນເບີໂທທີ່ຖືກຕ້ອງ (ຢ່າງໜ້ອຍ 8 ຕົວເລກ)';
    if (!formData.address.trim()) newErrors.address = 'ກະລຸນາປ້ອນທີ່ຢູ່';
    if (!formData.username.trim()) newErrors.username = 'ກະລຸນາປ້ອນຊື່ບັນຊີ';
    if (!formData.password.trim()) newErrors.password = 'ກະລຸນາປ້ອນລະຫັດຜ່ານ';
    if (!formData.bd) newErrors.bd = 'ກະລຸນາເລືອກວັນເກີດ';
    if (!['admin', 'manager'].includes(formData.role)) newErrors.role = 'ກະລຸນາເລືອກບົດບາດ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/employee');
      setEmployees(res.data);
    } catch (error) {
      console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນພະນັກງານ:', error);
      Toast.fire({
        icon: 'error',
        title: 'ດຶງຂໍ້ມູນບໍ່ສຳເລັດ'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/employee/${editingId}`, formData);
        Toast.fire({
          icon: 'success',
          title: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ'
        });
        resetForm();
        fetchEmployees();
      } else {
        const result = await Swal.fire({
          title: 'ຕ້ອງການເພີ່ມພະນັກງານຕໍ່ບໍ່?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'ເພີ່ມຕໍ່',
          cancelButtonText: 'ບັນທຶກແລະລ້າງຟອມ'
        });

        await axios.post('http://localhost:8000/api/employee', formData);
        Toast.fire({
          icon: 'success',
          title: 'ເພີ່ມຂໍ້ມູນສຳເລັດ'
        });

        if (!result.isConfirmed) {
          resetForm();
        }
        fetchEmployees();
      }
    } catch (error) {
      console.error('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກພະນັກງານ:', error);
      Toast.fire({
        icon: 'error',
        title: error.response?.data?.msg || 'ບັນທຶກບໍ່ສຳເລັດ'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ເຈົ້າແນ່ໃຈບໍ່?',
      text: 'ລົບແລ້ວຈະບໍ່ສາມາດກູ້ຄືນໄດ້!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ລົບ!',
      cancelButtonText: 'ຍົກເລີກ'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/employee/${id}`);
        fetchEmployees();
        Toast.fire({
          icon: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ'
        });
      } catch (error) {
        console.error('ເກີດຂໍ້ຜິດພາດໃນການລົບພະນັກງານ:', error);
        Toast.fire({
          icon: 'error',
          title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ'
        });
      }
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      phone: employee.phone,
      address: employee.address,
      username: employee.username,
      password: employee.password,
      bd: employee.bd ? new Date(employee.bd).toISOString().split('T')[0] : '',
      role: employee.role
    });
    setEditingId(employee.emp_id);
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      username: '',
      password: '',
      bd: '',
      role: 'admin'
    });
    setEditingId(null);
    setErrors({});
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <div className="p-4 sm:p-8 w-full mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-blue-600 font-noto-sans-lao">
        {editingId ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມຂໍ້ມູນພະນັກງານ'}
      </h1>

      {/* Form Section */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-8 sm:mb-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="ຊື່"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-noto-sans-lao"
              required
              aria-label="ຊື່ພະນັກງານ"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.name}</p>}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="ເບີໂທ"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-noto-sans-lao"
              required
              aria-label="ເບີໂທພະນັກງານ"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.phone}</p>}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="ທີ່ຢູ່"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-noto-sans-lao"
              required
              aria-label="ທີ່ຢູ່ພະນັກງານ"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.address}</p>}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="ຊື່ບັນຊີ"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-noto-sans-lao"
              required
              aria-label="ຊື່ບັນຊີພະນັກງານ"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.username}</p>}
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="ລະຫັດຜ່ານ"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-noto-sans-lao"
              required
              aria-label="ລະຫັດຜ່ານພະນັກງານ"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.password}</p>}
          </div>
          <div className="relative">
            <input
              type="date"
              value={formData.bd}
              onChange={(e) => setFormData({ ...formData, bd: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-noto-sans-lao"
              required
              aria-label="ວັນເກີດພະນັກງານ"
            />
            {errors.bd && <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.bd}</p>}
          </div>
          <div className="relative">
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 font-noto-sans-lao"
              required
              aria-label="ບົດບາດພະນັກງານ"
            >
              <option value="admin">ພະນັກງານ</option>
              <option value="manager">ຜູ້ຈັດການ</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1 font-noto-sans-lao">{errors.role}</p>}
          </div>
          <div className="col-span-1 sm:col-span-2 flex justify-end gap-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-base font-noto-sans-lao transition-colors"
                aria-label="ຍົກເລີກການແກ້ໄຂ"
              >
                ຍົກເລີກ
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base font-noto-sans-lao transition-colors"
              aria-label={editingId ? 'ແກ້ໄຂພະນັກງານ' : 'ເພີ່ມພະນັກງານ'}
            >
              {editingId ? 'ແກ້ໄຂ' : 'ເພີ່ມ'}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {loading ? (
          <div className="text-center p-6 font-noto-sans-lao flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            ກຳລັງໂຫຼດ...
          </div>
        ) : (
          <table className="w-full table-auto text-xs sm:text-sm text-left">
            <thead className="bg-blue-200 text-gray-900 sticky top-0">
              <tr>
                <th className="p-4 font-noto-sans-lao min-w-[120px] w-[15%]">ລະຫັດ</th>
                <th className="p-4 font-noto-sans-lao min-w-[120px] w-[15%]">ຊື່</th>
                <th className="p-4 font-noto-sans-lao min-w-[100px] w-[12%]">ເບີໂທ</th>
                <th className="p-4 font-noto-sans-lao min-w-[200px] w-[25%]">ທີ່ຢູ່</th>
                <th className="p-4 font-noto-sans-lao min-w-[120px] w-[15%]">ຊື່ບັນຊີ</th>
                <th className="p-4 font-noto-sans-lao min-w-[100px] w-[12%]">ວັນເກີດ</th>
                <th className="p-4 font-noto-sans-lao min-w-[100px] w-[12%]">ບົດບາດ</th>
                <th className="p-4 font-noto-sans-lao min-w-[160px] w-[20%] text-center">ການດຳເນີນການ</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 font-noto-sans-lao text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.emp_id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="p-4 font-noto-sans-lao">{emp.emp_id}</td>
                    <td className="p-4 font-noto-sans-lao">{emp.name}</td>
                    <td className="p-4 font-noto-sans-lao">{emp.phone}</td>
                    <td className="p-4 font-noto-sans-lao">{emp.address}</td>
                    <td className="p-4 font-noto-sans-lao">{emp.username}</td>
                    <td className="p-4 font-noto-sans-lao">{formatDate(emp.bd)}</td>
                    <td className="p-4 font-noto-sans-lao">{emp.role === 'admin' ? 'ພະນັກງານ' : 'ຜູ້ຈັດການ'}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-noto-sans-lao transition-colors"
                        onClick={() => handleEdit(emp)}
                        aria-label={`ແກ້ໄຂພະນັກງານ ${emp.name}`}
                      >
                        ແກ້ໄຂ
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-noto-sans-lao transition-colors"
                        onClick={() => handleDelete(emp.emp_id)}
                        aria-label={`ລົບພະນັກງານ ${emp.name}`}
                      >
                        ລົບ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Employee;