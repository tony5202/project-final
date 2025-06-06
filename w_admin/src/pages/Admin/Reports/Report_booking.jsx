import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Download, Search, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format, addDays, subDays } from 'date-fns';

const Report_booking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchParams, setSearchParams] = useState({
    startDate: null,
    endDate: null,
    status: '',
  });

  // Format price as LAK currency
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format date to DD/MM/YYYY, add 1 day for non-checkin dates, and an extra day for event bookings
  const formatDisplayDate = (dateStr, isCheckinDate = false, bookingType = null) => {
    if (!dateStr) return '-';
    try {
      const normalizedDateStr = dateStr.split('T')[0];
      const date = parse(normalizedDateStr, 'yyyy-MM-dd', new Date());
      if (isNaN(date)) return '-';
      let displayDate = isCheckinDate ? date : addDays(date, 1);
      if (!isCheckinDate && bookingType === 'event') {
        displayDate = addDays(displayDate, 1);
      }
      return format(displayDate, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date parsing error:', error, 'Input:', dateStr);
      return '-';
    }
  };

  // Format date for filtering (yyyy-MM-dd)
  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display (add 1 day for search params)
  const formatSearchDisplayDate = (date) => {
    if (!date) return 'ທຸກວັນ';
    return format(addDays(date, 1), 'dd/MM/yyyy');
  };

  // Format time slot, return 'ໝົດມື້' for event bookings
  const formatTimeSlot = (timeSlot, bookingType) => {
    if (bookingType === 'event') {
      return 'ໝົດມື້';
    }
    return timeSlot || '-';
  };

  // Calculate status counts
  const getStatusCounts = () => {
    return {
      pending: filteredBookings.filter((b) => b.status === 'pending').length,
      confirmed: filteredBookings.filter((b) => b.status === 'confirmed').length,
      cancelled: filteredBookings.filter((b) => b.status === 'cancelled').length,
      completed: filteredBookings.filter((b) => b.status === 'completed').length,
    };
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/report-booking', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      console.log('Fetched bookings:', res.data);
      const validData = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(validData);
      setFilteredBookings(validData);
    } catch (err) {
      console.error('Fetch error:', err.response ? err.response.data : err.message);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ຮູນການຈອງ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearch = () => {
    const { startDate, endDate, status } = searchParams;

    if (startDate && endDate && startDate > endDate) {
      toast.error('ວັນທີ່ເລີ່ມຕ້ອງກ່ອນວັນທີ່ສິ້ນສຸດ');
      return;
    }

    const queryStartDate = startDate ? subDays(startDate, 1) : null;
    const queryEndDate = endDate ? subDays(endDate, 1) : null;

    let filtered = bookings;

    if (startDate || endDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = booking.booking_date.split('T')[0];
        const parsedBookingDate = parse(bookingDate, 'yyyy-MM-dd', new Date());
        if (isNaN(parsedBookingDate.getTime())) return false;

        const compareDate = booking.booking_type === 'event' ? addDays(parsedBookingDate, 1) : parsedBookingDate;

        const start = queryStartDate ? formatDate(queryStartDate) : '1970-01-01';
        const end = queryEndDate ? formatDate(queryEndDate) : '9999-12-31';
        return bookingDate >= start && bookingDate <= end;
      });
    }

    if (status) {
      filtered = filtered.filter((booking) => booking.status === status);
    }

    setFilteredBookings(filtered);
    toast.success('ຄົ້ນຫາການຈອງສຳເລັດ');
  };

  const handleClear = () => {
    setSearchParams({ startDate: null, endDate: null, status: '' });
    setFilteredBookings(bookings);
    toast.info('ລ້າງຂໍ້ມູນການຄົ້ນຫາສຳເລັດ');
  };

  const exportToExcel = async () => {
    if (filteredBookings.length === 0) {
      toast.warn('ບໍ່ມີຂໍ້ຮູນການຈອງສຳລັບສົ່ງອອກ');
      return;
    }

    setExporting(true);
    try {
      const headers = [
        'ລະຫັດການຈອງ',
        'ຜູ້ຈອງ',
        'ເບີໂທ',
        'ສະໜາມ',
        'ວັນທີ່ຈອງ',
        'ເວລາ',
        'ລາຄາ',
        'ພະນັກງານທີ່ຈັດການ',
        'ສະຖານະ',
        'ປະເພດການຈອງ',
      ];
      const data = filteredBookings.map((booking) => [
        booking.id || '-',
        booking.user_name || '-',
        booking.user_phone || '-',
        booking.stadium_dtail || '-',
        formatDisplayDate(booking.booking_date, false, booking.booking_type),
        formatTimeSlot(booking.time_slot, booking.booking_type),
        formatCurrency(booking.price),
        booking.username || '-',
        booking.status || '-',
        booking.booking_type || '-',
      ]);

      const spacer = ['', '', '', '', '', '', '', '', '', ''];
      const totalRow = [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'ຈຳນວນການຈອງທັງໝົດ',
        '',
        `${filteredBookings.length} ລາຍການ`,
      ];
      const { startDate, endDate, status } = searchParams;
      const filterRows = [];
      if (startDate || endDate) {
        const displayStart = startDate ? formatSearchDisplayDate(startDate) : 'ທຸກວັນ';
        const displayEnd = endDate ? formatSearchDisplayDate(endDate) : 'ທຸກວັນ';
        filterRows.push([
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'ຊ່ວງວັນທີ່',
          '',
          `${displayStart} - ${displayEnd}`,
        ]);
      }
      if (status) {
        filterRows.push([
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'ສະຖານະ',
          '',
          status,
        ]);
      }
      const statusCounts = getStatusCounts();
      const statusCountRows = [
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'ລໍຖ້າການຢືນຢັນ',
          '',
          `${statusCounts.pending} ລາຍການ`,
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'ຢືນຢັນແລ້ວ',
          '',
          `${statusCounts.confirmed} ລາຍກาນ`,
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'ຍົກເລີກ',
          '',
          `${statusCounts.cancelled} ລາຍການ`,
        ],
        [
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'ສຳເລັດ',
          '',
          `${statusCounts.completed} ລາຍການ`,
        ],
      ];

      const sheetData = [
        headers,
        ...data,
        spacer,
        totalRow,
        ...filterRows,
        ...statusCountRows,
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

      const colWidths = headers.map((header, i) => ({
        wch: Math.max(
          header.length,
          ...data.map((row) => (row[i] ? row[i].toString().length : 0)),
          totalRow[i] ? totalRow[i].toString().length : 0,
          ...filterRows.map((row) => (row[i] ? row[i].toString().length : 0)),
          ...statusCountRows.map((row) =>
            row[i] ? row[i].toString().length : 0
          )
        ) + 2,
      }));
      worksheet['!cols'] = colWidths;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const fileName = `booking_report_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success('ສົ່ງອອກຂໍ້ມູນການຈອງເປັນ Excel ສຳເລັດ');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການສົງອອກ Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-noto-sans-lao">
      {/* Header Section */}
      <div className="p-4 space-y-3 w-full max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <button
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
            onClick={handleBack}
            aria-label="Previous page"
            disabled={loading || exporting}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ຖອຍກັບ
          </button>
          <button
            className="w-full sm:w-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md disabled:bg-green-400 disabled:cursor-not-allowed"
            onClick={exportToExcel}
            aria-label="Export to Excel"
            disabled={loading || exporting}
          >
            {exporting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            {exporting ? 'ກາລາງ...' : 'ສັງອອກ Excel'}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-7xl mt-4 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ຄົ້ນຫາຕາມວັນທີ່ແລະສະຖານະ
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <DatePicker
              selected={searchParams.startDate}
              onChange={(date) => setSearchParams({ ...searchParams, startDate: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="ວັນທີເລີ່ມ (dd/mm/yyyy)"
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="Start date"
              disabled={loading || exporting}
            />
            <span className="text-xl">ຫາ</span>
            <DatePicker
              selected={searchParams.endDate}
              onChange={(date) => setSearchParams({ ...searchParams, endDate: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="ສິນສຸດ (dd/mm/yyyy)"
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="End date"
              disabled={loading || exporting}
            />
            <select
              value={searchParams.status}
              onChange={(e) =>
                setSearchParams({ ...searchParams, status: e.target.value })
              }
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="Status"
              disabled={loading || exporting}
            >
              <option value="">ທຸກສະຖານະ</option>
              <option value="pending">ລໍຖ້າ</option>
              <option value="confirmed">ອະນຸມັດ</option>
              <option value="cancelled">ປະຕິເສດ</option>
              <option value="completed">ສຳເລັດ</option>
            </select>
            <div className="flex gap-2">
              <button
                className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSearch}
                aria-label="Search"
                disabled={loading || exporting}
              >
                <Search className="w-5 h-5 mr-2" />
                ຄ້ນ
              </button>
              <button
                className="w-full sm:w-auto flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleClear}
                aria-label="Clear"
                disabled={
                  loading ||
                  exporting ||
                  (!searchParams.startDate && !searchParams.endDate && !searchParams.status)
                }
              >
                <X className="w-5 h-5 mr-2" />
                ລ້າງ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-7xl mt-6 p-6 bg-white rounded-xl shadow-lg">
        <h1
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          id="table-title"
        >
          ລາຍງານການຈອງ
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table
                className="min-w-full table-auto text-base"
                aria-describedby="table-title"
              >
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="py-3 px-4 text-center font-medium">ລະຫັດ</th>
                    <th className="py-3 px-4 text-center font-medium">ຜູ້ຈອງ</th>
                    <th className="py-3 px-4 text-center font-medium">ເບີ</th>
                    <th className="py-3 px-4 text-center font-medium">ສະ</th>
                    <th className="py-3 px-4 text-center font-medium">วันที่</th>
                    <th className="py-3 px-4 text-center font-medium">เวลา</th>
                    <th className="py-3 px-4 text-center font-medium">ราคา</th>
                    <th className="py-3 px-4 text-center font-medium">พนักงาน</th>
                    <th className="py-3 px-4 text-center font-medium">สถานะ</th>
                    <th className="py-3 px-4 text-center font-medium">ประเภท</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-t hover:bg-gray-50 transition-all"
                      >
                        <td className="py-3 px-4 text-center">{booking.id || '-'}</td>
                        <td className="py-3 px-4 text-center">{booking.user_name || '-'}</td>
                        <td className="py-3 px-4 text-center">{booking.user_phone || '-'}</td>
                        <td className="py-3 px-4 text-center">{booking.stadium_dtail || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          {formatDisplayDate(booking.booking_date, false, booking.booking_type)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {formatTimeSlot(booking.time_slot, booking.booking_type)}
                        </td>
                        <td className="py-3 px-4 text-center">{formatCurrency(booking.price)}</td>
                        <td className="py-3 px-4 text-center">{booking.employee_username || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          {booking.status === 'pending'
                            ? 'ລໍຖ້າ'
                            : booking.status === 'confirmed'
                            ? 'ອະນຸ'
                            : booking.status === 'cancelled'
                            ? 'ປະ'
                            : booking.status === 'completed'
                            ? 'ສຳ'
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {booking.booking_type === 'football'
                            ? 'ຟຸ'
                            : booking.booking_type === 'event'
                            ? 'ກິດ'
                            : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4 text-gray-500">
                        ບໍ່ມີຂໍ້ມູນການຈອງ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredBookings.length > 0 && (
              <div className="mt-6 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ຈຳນວນທັງໝົດ: <span className="text-black">{filteredBookings.length} ລາຍ</span>
                </p>
                {(searchParams.startDate || searchParams.endDate) && (
                  <p className="text-sm text-gray-600">
                    วันที่:{' '}
                    {searchParams.startDate
                      ? formatSearchDisplayDate(searchParams.startDate)
                      : 'ทุกวัน'}{' '}
                    -{' '}
                    {searchParams.endDate
                      ? formatSearchDisplayDate(searchParams.endDate)
                      : 'ทุกวัน'}
                  </p>
                )}
                {searchParams.status && (
                  <p className="text-sm text-gray-600">
                    สถานะ:{' '}
                    {searchParams.status === 'pending'
                      ? 'ລໍຖ້າ'
                      : searchParams.status === 'confirmed'
                      ? 'ອະນຸ'
                      : searchParams.status === 'cancelled'
                      ? 'ປະ'
                      : searchParams.status === 'completed'
                      ? 'ສຳ'
                      : '-'}
                  </p>
                )}
                <div className="mt-2">
                  <p className="text-sm text-yellow-600">
                    ລໍຖ້າ: <span className="text-black">{getStatusCounts().pending} ລາຍ</span>
                  </p>
                  <p className="text-sm text-green-600">
                    ອະນຸ: <span className="text-black">{getStatusCounts().confirmed} ລາຍ</span>
                  </p>
                  <p className="text-sm text-red-600">
                    ປະ: <span className="text-black">{getStatusCounts().cancelled} ລາຍ</span>
                  </p>
                  <p className="text-sm text-blue-600">
                    ສຳ: <span className="text-black">{getStatusCounts().completed} ລາຍ</span>
                  </p>
                </div>
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

export default Report_booking;