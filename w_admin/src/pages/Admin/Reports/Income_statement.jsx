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

const Income_statement = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/income-report');
      console.log('Fetched sales data:', res.data.sales);
      setSales(res.data.sales);
      setFilteredSales(res.data.sales);
      setTotalIncome(res.data.totalIncome);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍຮັບ');
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍຮັບ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr || dateStr === '1970-01-01 00:00:00') return 'ບໍ່ມີຂໍ້ມູນວັນທີ';
    try {
      const date = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, 'dd/MM/yyyy HH:mm:ss');
    } catch (error) {
      console.error('Date parsing error:', error, 'Input:', dateStr);
      return 'ບໍ່ມີຂໍ້ມູນວັນທີ';
    }
  };

  const formatDisplayDateOnly = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date parsing error:', error, 'Input:', dateStr);
      return '-';
    }
  };

  const filterSales = useCallback(() => {
    if (!startDate && !endDate) {
      setFilteredSales(sales);
      const total = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);
      setTotalIncome(total);
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error('ວັນທີເລີ່ມຕ້ອງບໍ່ຫຼັງວັນທີສິ້ນສຸດ');
      return;
    }

    const start = startDate ? formatDate(startDate) : null;
    const end = endDate ? formatDate(endDate) : null;

    const fetchFilteredSales = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/income-report', {
          params: { startDate: start, endDate: end },
        });
        setFilteredSales(res.data.sales);
        setTotalIncome(res.data.totalIncome);
      } catch (err) {
        console.error('Fetch filtered sales error:', err);
        toast.error('ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາລາຍຮັບ');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredSales();
  }, [startDate, endDate, sales]);

  useEffect(() => {
    if (startDate || endDate) {
      filterSales();
    } else {
      setFilteredSales(sales);
      const total = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);
      setTotalIncome(total);
    }
  }, [startDate, endDate, sales, filterSales]);

  const handleSearch = () => {
    filterSales();
    toast.success('ຄົ້ນຫາລາຍຮັບສຳເລັດ');
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredSales(sales);
    const total = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);
    setTotalIncome(total);
    toast.info('ລ້າງຂໍ້ມູນການຄົ້ນຫາສຳເລັດ');
  };

  const exportToExcel = async () => {
    if (filteredSales.length === 0) {
      toast.warn('ບໍ່ມີຂໍ້ມູນລາຍຮັບສຳລັບສົ່ງອອກ');
      return;
    }

    setExporting(true);
    try {
      const groupedSales = filteredSales.reduce((acc, sale) => {
        if (!acc[sale.sale_id]) {
          acc[sale.sale_id] = {
            sale_id: sale.sale_id,
            totalAmount: sale.totalAmount,
            receivedmoney: sale.receivedmoney,
            date_time: sale.date_time,
            emp_id: sale.emp_id,
            username: sale.username,
            products: [],
          };
        }
        if (sale.product_id) {
          acc[sale.sale_id].products.push({
            product_id: sale.product_id,
            product_name: sale.product_name,
            quantity: sale.quantity,
            price: sale.price,
          });
        }
        return acc;
      }, {});

      const salesData = Object.values(groupedSales);

      const headers = ['ລະຫັດການຂາຍ', 'ສິນຄ້າທີ່ຂາຍ', 'ຈຳນວນ', 'ລາຄາລວມ', 'ຍອດຂາຍ', 'ເງິນທີ່ຮັບ', 'ວັນທີ', 'ພະນັກງານ'];
      const data = salesData.map((sale) => {
        const productsStr = sale.products.map((p) => `${p.product_name} (${p.quantity} x ${formatCurrency(p.price)})`).join(', ');
        return [
          sale.sale_id,
          productsStr || '-',
          sale.products.reduce((sum, p) => sum + p.quantity, 0) || '-',
          sale.products.reduce((sum, p) => sum + p.price * p.quantity, 0)
            ? formatCurrency(sale.products.reduce((sum, p) => sum + p.price * p.quantity, 0))
            : '-',
          formatCurrency(sale.totalAmount),
          formatCurrency(sale.receivedmoney),
          formatDisplayDate(sale.date_time),
          sale.username || 'ບໍ່ມີຂໍ້ມູນ',
        ];
      });

      const spacer = ['', '', '', '', '', '', '', ''];
      const totalRow = ['', '', '', '', 'ລວມລາຍຮັບທັງໝົດ', formatCurrency(totalIncome), '', ''];
      const dateRangeRow = startDate && endDate ? [
        '',
        '',
        '',
        '',
        'ຊ່ວງວັນທີ',
        `${formatDisplayDateOnly(formatDate(startDate))} - ${formatDisplayDateOnly(formatDate(endDate))}`,
        '',
        '',
      ] : null;

      const sheetData = [
        headers,
        ...data,
        spacer,
        totalRow,
        ...(dateRangeRow ? [dateRangeRow] : []),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Income Statement');

      const colWidths = headers.map((header, i) => ({
        wch: Math.max(
          header.length,
          ...data.map((row) => (row[i] ? row[i].toString().length : 0)),
          totalRow[i] ? totalRow[i].toString().length : 0,
          dateRangeRow && dateRangeRow[i] ? dateRangeRow[i].toString().length : 0
        ) + 2,
      }));
      worksheet['!cols'] = colWidths;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const fileName = `income_statement_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success('ສົ່ງອອກຂໍ້ມູນລາຍຮັບເປັນ Excel ສຳເລັດ');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກ Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const handleRetry = () => {
    fetchSales();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-noto-sans-lao p-4">
      {/* Header Section */}
      <header className="w-full max-w-7xl mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            onClick={handleBack}
            aria-label="Back to home page"
            disabled={loading || exporting}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ຍ້ອນກັຬໜ້າຫຼັກ
          </button>
          <button
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 disabled:bg-green-400 disabled:cursor-not-allowed"
            onClick={exportToExcel}
            aria-label="Export to Excel"
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
      </header>

      {/* Search Section */}
      <section className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4" id="search-section">
          ຄົ້ນຫາຕາມຊ່ວງວັນທີ
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="ວັນທີເລີ່ມ (ວວ/ດດ/ປປປປ)"
            className="w-full sm:w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-label="Start date"
            aria-describedby="search-section"
            disabled={loading || exporting}
          />
          <span className="text-xl text-black">ຫາ</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="ສິ້ນສຸດ (ວວ/ດດ/ປປປປ)"
            className="w-full sm:w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-label="End date"
            aria-describedby="search-section"
            disabled={loading || exporting}
          />
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
              onClick={handleSearch}
              aria-label="Search"
              disabled={loading || exporting}
            >
              <Search className="w-5 h-5 mr-2" />
              ຄົ້ນຫາ
            </button>
            <button
              className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleClear}
              aria-label="Clear"
              disabled={loading || exporting || (!startDate && !endDate)}
            >
              <X className="w-5 h-5 mr-2" />
              ລ້າງ
            </button>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6" id="income-statement-title">
          ລາຍງານລາຍຮັບຈາກການຂາຍ
        </h1>
        {loading ? (
          <div className="flex justify-center py-10" role="alert" aria-label="Loading data">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-600" role="alert">
            <p>{error}</p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300"
              onClick={handleRetry}
              aria-label="Retry fetching data"
            >
              ລອງໃໝ່
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" aria-describedby="income-statement-title">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ລະຫັດການຂາຍ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ສິນຄ້າທີ່ຂາຍ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ຈຳນວນ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ລາຄາລວມ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ຍອດຂາຍ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ເງິນທີ່ຮັບ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ວັນທີ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ພະນັກງານ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales.length > 0 ? (
                    Object.values(
                      filteredSales.reduce((acc, sale) => {
                        if (!acc[sale.sale_id]) {
                          acc[sale.sale_id] = {
                            sale_id: sale.sale_id,
                            totalAmount: sale.totalAmount,
                            receivedmoney: sale.receivedmoney,
                            date_time: sale.date_time,
                            emp_id: sale.emp_id,
                            username: sale.username,
                            products: [],
                          };
                        }
                        if (sale.product_id) {
                          acc[sale.sale_id].products.push({
                            product_id: sale.product_id,
                            product_name: sale.product_name,
                            quantity: sale.quantity,
                            price: sale.price,
                          });
                        }
                        return acc;
                      }, {})
                    ).map((sale) => (
                      <tr key={sale.sale_id} className="hover:bg-gray-50 transition-all">
                        <td className="py-4 px-4 text-sm text-gray-900">{sale.sale_id}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {sale.products.length > 0
                            ? sale.products.map((p) => `${p.product_name} (${p.quantity} x ${formatCurrency(p.price)})`).join(', ')
                            : '-'}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">{sale.products.reduce((sum, p) => sum + p.quantity, 0) || '-'}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {sale.products.reduce((sum, p) => sum + p.price * p.quantity, 0)
                            ? formatCurrency(sale.products.reduce((sum, p) => sum + p.price * p.quantity, 0))
                            : '-'}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">{formatCurrency(sale.totalAmount)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{formatCurrency(sale.receivedmoney)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{formatDisplayDate(sale.date_time)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{sale.username || 'ບໍ່ມີຂໍ້ມູນ'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-4 text-center text-gray-500 text-sm" role="alert">
                        ບໍ່ມີຂໍ້ມູນລາຍຮັບ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredSales.length > 0 && (
              <div className="mt-6 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ລວມລາຍຮັບທັງໝົດ:{' '}
                  <span className="text-green-600 font-bold text-2xl">
                    {formatCurrency(totalIncome)}
                  </span>
                </p>
                {startDate && endDate && (
                  <p className="text-sm text-gray-600">
                    ຊ່ວງວັນທີ: {formatDisplayDateOnly(formatDate(startDate))} - {formatDisplayDateOnly(formatDate(endDate))}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </section>

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

export default Income_statement;