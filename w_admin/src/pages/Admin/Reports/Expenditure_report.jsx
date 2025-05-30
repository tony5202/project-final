import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Download, Search, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';

const Expenditure_report = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState('');
  const [totalExpenditure, setTotalExpenditure] = useState(0);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/expenses');
      console.log('Fetched expenses:', res.data);
      setExpenses(res.data);
      setFilteredExpenses(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍຈ່າຍ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const total = filteredExpenses.reduce((sum, expense) => {
      return sum + parseFloat(expense.total || 0);
    }, 0);
    setTotalExpenditure(total);
  }, [filteredExpenses]);

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (isNaN(date)) return '-';
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date parsing error:', error, 'Input:', dateStr);
      return '-';
    }
  };

  const filterExpenses = useCallback(() => {
    if (!startDate && !endDate && !category) {
      setFilteredExpenses(expenses);
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error('ວັນທີເລີ່ມຕ້ອງບໍ່ຫຼັງວັນທີສິ້ນສຸດ');
      return;
    }

    const start = formatDate(startDate);
    const end = formatDate(endDate);
    const filtered = expenses.filter((expense) => {
      const expenseDate = expense.date;
      if (start && expenseDate < start) return false;
      if (end && expenseDate > end) return false;
      if (category) {
        const isProduct = expense.id_pro != null;
        return category === 'product' ? isProduct : !isProduct;
      }
      return true;
    });

    setFilteredExpenses(filtered);
  }, [startDate, endDate, category, expenses]);

  useEffect(() => {
    if (startDate || endDate || category) {
      filterExpenses();
    } else {
      setFilteredExpenses(expenses);
    }
  }, [startDate, endDate, category, expenses, filterExpenses]);

  const handleSearch = () => {
    filterExpenses();
    toast.success('ຄົ້ນຫາລາຍຈ່າຍສຳເລັດ');
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setCategory('');
    setFilteredExpenses(expenses);
    toast.info('ລ້າງຂໍ້ມູນການຄົ້ນຫາສຳເລັດ');
  };

  const exportToExcel = async () => {
    if (filteredExpenses.length === 0) {
      toast.warn('ບໍ່ມີຂໍ້ມູນລາຍຈ່າຍສຳລັບສົ່ງອອກ');
      return;
    }

    setExporting(true);
    try {
      const headers = ['ຊື່ສິນຄ້າ', 'ລາຍລະອຽດ', 'ຈຳນວນ', 'ຈຳນວນສິນຄ້າ', 'ລວມ', 'ວັນທີ', 'ປະເພດ'];
      const data = filteredExpenses.map((expense) => [
        expense.product_name || 'ເດີ່ນ',
        expense.detail || '-',
        formatCurrency(expense.amount || 0),
        expense.quantity !== null ? expense.quantity : '-',
        formatCurrency(expense.total || 0),
        formatDisplayDate(expense.date),
        expense.id_pro != null ? 'ສິນຄ້າ' : 'ເດີ່ນ',
      ]);

      const spacer = ['', '', '', '', '', '', ''];
      const totalRow = [
        '',
        '',
        '',
        '',
        'ລວມລາຍຈ່າຍທັງໝົດ',
        formatCurrency(totalExpenditure),
        '',
      ];
      const dateRangeRow = startDate && endDate ? [
        '',
        '',
        '',
        '',
        'ຊ່ວງວັນທີ',
        `${formatDisplayDate(formatDate(startDate))} - ${formatDisplayDate(formatDate(endDate))}`,
        '',
      ] : null;
      const categoryRow = category ? [
        '',
        '',
        '',
        '',
        'ປະເພດ',
        category === 'product' ? 'ສິນຄ້າ' : 'ເດີ່ນ',
        '',
      ] : null;

      const sheetData = [
        headers,
        ...data,
        spacer,
        totalRow,
        ...(dateRangeRow ? [dateRangeRow] : []),
        ...(categoryRow ? [categoryRow] : []),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

      const colWidths = headers.map((header, i) => ({
        wch: Math.max(
          header.length,
          ...data.map((row) => (row[i] ? row[i].toString().length : 0)),
          totalRow[i] ? totalRow[i].toString().length : 0,
          dateRangeRow && dateRangeRow[i] ? dateRangeRow[i].toString().length : 0,
          categoryRow && categoryRow[i] ? categoryRow[i].toString().length : 0
        ) + 2,
      }));
      worksheet['!cols'] = colWidths;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const fileName = `expenditure_report_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success('ສົ່ງອອກຂໍ້ມູນລາຍຈ່າຍເປັນ Excel ສຳເລັດ');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກ Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleBack = () => {
    console.log('Navigating to /home');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-noto-sans-lao">
      {/* Header Section */}\
      
      <div className="p-4 space-y-3 w-full max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1
            className="text-3xl font-bold "
          
            
          >
            
            ລາຍງານລາຍຈ່າຍ ສິນຄ້າ ແລະ ເດີ່ນ
          </h1>
          <button
            className="w-full sm:w-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md disabled:bg-green-400 disabled:cursor-not-allowed"
            onClick={exportToExcel}
            aria-label="ສົ່ງອອກເປັນ Excel"
            disabled={loading || exporting}
          >
            {exporting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            {exporting ? 'ກຳລັງສົ່ງອອກ...' : 'ສົ່ງອອກເປັນ Excel'}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-7xl mt-4 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">ຄົ້ນຫາຕາມຊ່ວງວັນທີ ແລະ ປະເພດ</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="ວັນທີເລີ່ມ (ວວ/ດດ/ປປປປ)"
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ວັນທີເລີ່ມ"
              disabled={loading || exporting}
            />
            <span className="text-xl text-black">ຫາ</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="ສິ້ນສຸດ (ວວ/ດດ/ປປປປ)"
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ວັນທີສິ້ນສຸດ"
              disabled={loading || exporting}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ປະເພດ"
              disabled={loading || exporting}
            >
              <option value="">ທຸກປະເພດ</option>
              <option value="product">ສິນຄ້າ</option>
              <option value="stadium">ເດີ່ນ</option>
            </select>
            <div className="flex gap-2">
              <button
                className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
                onClick={handleSearch}
                aria-label="ຄົ້ນຫາ"
                disabled={loading || exporting}
              >
                <Search className="w-5 h-5 mr-2" />
                ຄົ້ນຫາ
              </button>
              <button
                className="w-full sm:w-auto flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleClear}
                aria-label="ລ້າງ"
                disabled={loading || exporting || (!startDate && !endDate && !category)}
              >
                <X className="w-5 h-5 mr-2" />
                ລ້າງ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-7xl mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800" id="expenditure-report-title">
          ລາຍງານລາຍຈ່າຍ
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-base" aria-describedby="expenditure-report-title">
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="py-3 px-4 text-left font-medium" scope="col">ຊື່ສິນຄ້າ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ລາຍລະອຽດ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ຈຳນວນ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ຈຳນວນສິນຄ້າ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ລວມ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ວັນທີ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ປະເພດ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-t hover:bg-gray-50 transition-all">
                        <td className="py-3 px-4">{expense.product_name || ' __'}</td>
                        <td className="py-3 px-4">{expense.detail || '-'}</td>
                        <td className="py-3 px-4">{formatCurrency(expense.amount || 0)}</td>
                        <td className="py-3 px-4">{expense.quantity !== null ? expense.quantity : '-'}</td>
                        <td className="py-3 px-4">{formatCurrency(expense.total || 0)}</td>
                        <td className="py-3 px-4">{formatDisplayDate(expense.date)}</td>
                        <td className="py-3 px-4">{expense.id_pro != null ? 'ສິນຄ້າ' : 'ເດີ່ນ'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        ບໍ່ມີຂໍ້ມູນລາຍຈ່າຍ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredExpenses.length > 0 && (
              <div className="mt-6 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ລວມລາຍຈ່າຍທັງໝົດ:{' '}
                  <span className="text-red-600 font-bold text-2xl">
                    {formatCurrency(totalExpenditure)}
                  </span>
                </p>
                {startDate && endDate && (
                  <p className="text-sm text-gray-600">
                    ຊ່ວງວັນທີ: {formatDisplayDate(formatDate(startDate))} - {formatDisplayDate(formatDate(endDate))}
                  </p>
                )}
                {category && (
                  <p className="text-sm text-gray-600">
                    ປະເພດ: {category === 'product' ? 'ສິນຄ້າ' : 'ເດີ່ນ'}
                  </p>
                )}
              </div>
            )}
          </>
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

export default Expenditure_report;