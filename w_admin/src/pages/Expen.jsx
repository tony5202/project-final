import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

const Expen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    detail: '',
    amount: '',
    quantity: '',
    date: '',
    id_pro: ''
  });
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return '-';
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/expenses');
      setExpenses(res.data);
    } catch (err) {
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍຈ່າຍ');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/product');
      setProducts(res.data);
    } catch (err) {
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ');
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.id_pro && !formData.quantity) {
      toast.error('ກະລຸນາປ້ອນຈຳນວນສຳລັບລາຍຈ່າຍສິນຄ້າ');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/expense', {
        ...formData,
        id_pro: formData.id_pro || null,
        quantity: formData.quantity ? Number(formData.quantity) : null
      });
      toast.success('ເພີ່ມລາຍຈ່າຍສຳເລັດ!');
      fetchExpenses();
      setFormData({ detail: '', amount: '', quantity: '', date: '', id_pro: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'ເພີ່ມລາຍຈ່າຍລົ້ມເຫຼວ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-noto-sans-lao">
      {/* Back Button */}
      <div className="p-4 space-y-3 w-full max-w-7xl">
        <button
          className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
          onClick={() => navigate('/home')}
          aria-label="ຍ້ອນກັຬໜ້າຫຼັກ"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          ຍ້ອນກັຬໜ້າຫຼັກ
        </button>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-2xl mt-6 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">ເພີ່ມລາຍຈ່າຍ</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ລາຍລະອຽດ</label>
            <input
              type="text"
              name="detail"
              placeholder="ລາຍລະອຽດ"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
              onChange={handleChange}
              value={formData.detail}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ຈຳນວນເງິນ (ຕໍ່ຫນ່ວຍ)</label>
            <input
              type="number"
              name="amount"
              placeholder="ຈຳນວນເງິນ (ຕໍ່ຫນ່ວຍ)"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
              onChange={handleChange}
              value={formData.amount}
              required
              step="0.01"
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ຈຳນວນ</label>
            <input
              type="number"
              name="quantity"
              placeholder="ຈຳນວນ (ປ່ອຍຫວ່າງໄດ້ຖ້າບໍ່ແມ່ນສິນຄ້າ)"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onChange={handleChange}
              value={formData.quantity}
              disabled={formData.id_pro === ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ວັນທີ</label>
            <input
              type="date"
              name="date"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
              onChange={handleChange}
              value={formData.date}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ສິນຄ້າ</label>
            <select
              name="id_pro"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
              onChange={handleChange}
              value={formData.id_pro}
            >
              <option value="">ບໍ່ແມ່ນສິນຄ້າ (ສະໜາມ)</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all duration-300 text-lg font-medium shadow-md"
            aria-label="ເພີ່ມລາຍຈ່າຍ"
          >
            ເພີ່ມລາຍຈ່າຍ
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-7xl mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-red-600">ລາຍຈ່າຍທັງໝົດ</h1>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-base">
              <thead>
                <tr className="bg-blue-50 text-gray-700">
                  <th className="py-3 px-4 text-left font-medium">ລາຍລະອຽດ</th>
                  <th className="py-3 px-4 text-left font-medium">ສິນຄ້າ</th>
                  <th className="py-3 px-4 text-left font-medium">ຈຳນວນເງິນ</th>
                  <th className="py-3 px-4 text-left font-medium">ຈຳນວນ</th>
                  <th className="py-3 px-4 text-left font-medium">ລວມ</th>
                  <th className="py-3 px-4 text-left font-medium">ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50 transition-all">
                      <td className="py-3 px-4">{item.detail}</td>
                      <td className="py-3 px-4">{item.product_name || 'ສະໜາມ'}</td>
                      <td className="py-3 px-4">{formatCurrency(item.amount)}</td>
                      <td className="py-3 px-4">{item.quantity ?? '-'}</td>
                      <td className="py-3 px-4">{formatCurrency(item.total)}</td>
                      <td className="py-3 px-4">{formatDate(item.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      ບໍ່ມີລາຍຈ່າຍ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Expen;