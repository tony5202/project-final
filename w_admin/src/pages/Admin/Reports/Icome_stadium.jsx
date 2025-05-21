import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2, Download, Search, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';

const Icome_stadium = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/report-booking');
      console.log('Fetched bookings data:', res.data); // Log full response
      const fetchedBookings = res.data.bookings || [];
      setBookings(fetchedBookings);
      setFilteredBookings(fetchedBookings);
      const total = fetchedBookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
      setTotalIncome(total);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍຮັບຈາກສະໜາມ');
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍຮັບຈາກສະໜາມ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'ບໍ່ມີຂໍ້ມູນວັນທີ';
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

  const filterBookings = useCallback(() => {
    if (!startDate && !endDate && !status) {
      setFilteredBookings(bookings);
      const total = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
      setTotalIncome(total);
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error('ວັນທີເລີ່ມຕ້ອງບໍ່ຫຼັງວັນທີສິ້ນສຸດ');
      return;
    }

    const start = startDate ? formatDate(startDate) : null;
    const end = endDate ? formatDate(endDate) : null;

    const fetchFilteredBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/report-booking', {
          params: { startDate: start, endDate: end, status },
        });
        console.log('Filtered bookings data:', res.data); // Log filtered response
        const fetchedBookings = res.data.bookings || [];
        setFilteredBookings(fetchedBookings);
        const total = fetchedBookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
        setTotalIncome(total);
      } catch (err) {
        console.error('Fetch filtered bookings error:', err);
        toast.error('ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາລາຍຮັບຈາກສະໜາມ');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredBookings();
  }, [startDate, endDate, status, bookings]);

  useEffect(() => {
    if (startDate || endDate || status) {
      filterBookings();
    } else {
      setFilteredBookings(bookings);
      const total = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
      setTotalIncome(total);
    }
  }, [startDate, endDate, status, bookings, filterBookings]);

  const handleSearch = () => {
    filterBookings();
    toast.success('ຄົ້ນຫາລາຍຮັບຈາກສະໜາມສຳເລັດ');
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setStatus('');
    setFilteredBookings(bookings);
    const total = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
    setTotalIncome(total);
    toast.info('ລ້າງຂໍ້ມູນການຄົ້ນຫາສຳເລັດ');
  };

  const exportToExcel = async () => {
    if (filteredBookings.length === 0) {
      toast.warn('ບໍ່ມີຂໍ້ມູນລາຍຮັບຈາກສະໜາມສຳລັບສົ່ງອອກ');
      return;
    }

    setExporting(true);
    try {
      const headers = [
        'ລະຫັດການຈອງ',
        'ຊື່ຜູ້ໃຊ້',
        'ເບີໂທ',
        'ລາຍລະອຽດສະໜາມ',
        'ປະເພດການຈອງ',
        'ວັນທີຈອງ',
        'ເວລາຈອງ',
        'ລາຄາ',
        'ຄ່າມັດຈຳ',
        'ຄ່າຊຳລະຫຼັງ',
        'ສະຖານະ',
        'ພະນັກງານ',
      ];
      const data = filteredBookings.map((booking) => [
        booking.id,
        booking.user_name || '-',
        booking.user_phone || '-',
        booking.stadium_dtail || '-',
        booking.booking_type,
        formatDisplayDateOnly(booking.booking_date),
        booking.time_slot,
        formatCurrency(booking.price),
        formatCurrency(booking.pre_pay),
        formatCurrency(booking.post_pay),
        booking.status,
        booking.username || 'ບໍ່ມີຂໍ້ມູນ',
      ]);

      const spacer = ['', '', '', '', '', '', '', '', '', '', '', ''];
      const totalRow = ['', '', '', '', '', '', '', 'ລວມລາຍຮັບທັງໝົດ', formatCurrency(totalIncome), '', '', ''];
      const dateRangeRow = startDate && endDate ? [
        '',
        '',
        '',
        '',
        '',
        'ຊ່ວງວັນທີ',
        `${formatDisplayDateOnly(formatDate(startDate))} - ${formatDisplayDateOnly(formatDate(endDate))}`,
        '',
        '',
        '',
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Stadium Income');

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
      const fileName = `stadium_income_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success('ສົ່ງອອກຂໍ້ມູນລາຍຮັບຈາກສະໜາມເປັນ Excel ສຳເລັດ');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກ Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleRetry = () => {
    fetchBookings();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-noto-sans-lao p-4">
      {/* Header Section */}
      <header className="w-full max-w-7xl mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            ລາຍງານລາຍຮັບຈາກສະໜາມ
          </h1>
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
          ຄົ້ນຫາຕາມຊ່ວງວັນທີ ແລະ ສະຖານະ
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
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-label="Status filter"
            disabled={loading || exporting}
          >
            <option value="">ທຸກສະຖານະ</option>
            <option value="pending">ລໍຖ້າການຢືນຢັນ</option>
            <option value="confirmed">ຢືນຢັນແລ້ວ</option>
            <option value="cancelled">ຍົກເລີກ</option>
            <option value="completed">ສຳເລັດ</option>
          </select>
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
              disabled={loading || exporting || (!startDate && !endDate && !status)}
            >
              <X className="w-5 h-5 mr-2" />
              ລ້າງ
            </button>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6" id="stadium-income-title">
          ລາຍງານລາຍຮັບຈາກສະໜາມ
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
              <table className="min-w-full divide-y divide-gray-200" aria-describedby="stadium-income-title">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ລະຫັດການຈອງ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ຊື່ຜູ້ໃຊ້</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ເບີໂທ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ລາຍລະອຽດສະໜາມ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ປະເພດການຈອງ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ວັນທີຈອງ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ເວລາຈອງ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ລາຄາ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ຄ່າມັດຈຳ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ຄ່າຊຳລະຫຼັງ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ສະຖານະ</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700" scope="col">ພະນັກງານ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-all">
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.id}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.user_name || '-'}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.user_phone || '-'}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.stadium_dtail || '-'}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.booking_type}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{formatDisplayDateOnly(booking.booking_date)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.time_slot}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{formatCurrency(booking.price)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{formatCurrency(booking.pre_pay)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{formatCurrency(booking.post_pay)}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.status}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{booking.username || 'ບໍ່ມີຂໍ້ມູນ'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="py-4 text-center text-gray-500 text-sm" role="alert">
                        ບໍ່ມີຂໍ້ມູນລາຍຮັບຈາກສະໜາມ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredBookings.length > 0 && (
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

export default Icome_stadium;