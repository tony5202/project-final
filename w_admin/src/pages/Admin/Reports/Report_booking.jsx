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

  // Format date to DD/MM/YYYY, add 1 day for non-checkin dates, and an extra day for Event bookings
  const formatDisplayDate = (dateStr, isCheckinDate = false, bookingType = null) => {
    if (!dateStr) return '-';
    try {
      const normalizedDateStr = dateStr.split('T')[0];
      const date = parse(normalizedDateStr, 'yyyy-MM-dd', new Date());
      if (isNaN(date)) return '-';
      // For checkin_date, display as-is; for others (e.g., booking_date), add 1 day
      let displayDate = isCheckinDate ? date : addDays(date, 1);
      // Add an extra day for Event bookings (only for booking_date, not checkin_date)
      if (!isCheckinDate && bookingType === 'Event') {
        displayDate = addDays(displayDate, 1); // Extra day for Event
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

  // Format time slot, return 'ໝົດມື້' for Event bookings
  const formatTimeSlot = (timeSlot, bookingType) => {
    if (bookingType === 'Event') {
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
      const res = await axios.get('http://localhost:8000/api/report-booking');
      console.log('Fetched bookings:', res.data);
      const validData = Array.isArray(res.data) ? res.data : [];
      setBookings(validData);
      setFilteredBookings(validData);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການຈອງ');
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

    // Adjust dates for query (subtract 1 day)
    const queryStartDate = startDate ? subDays(startDate, 1) : null;
    const queryEndDate = endDate ? subDays(endDate, 1) : null;

    let filtered = bookings;

    if (startDate || endDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = booking.booking_date.split('T')[0];
        const parsedBookingDate = parse(bookingDate, 'yyyy-MM-dd', new Date());
        if (isNaN(parsedBookingDate.getTime())) return false;

        const compareDate = booking.booking_type === 'Event' ? addDays(parsedBookingDate, 1) : parsedBookingDate;

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
          `${statusCounts.confirmed} ລາຍການ`,
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
            aria-label="ຍ້ອນກັຬໜ້າຫຼັກ"
            disabled={loading || exporting}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ຍ້ອນກັຬໜ້າຫຼັກ
          </button>
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ຄົ້ນຫາຕາມວັນທີ່ແລະສະຖານະ
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <DatePicker
              selected={searchParams.startDate}
              onChange={(date) => setSearchParams({ ...searchParams, startDate: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="ວັນທີເລີ່ມ (ວວ/ດດ/ປປປປ)"
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ວັນທີ່ເລີ່ມ"
              disabled={loading || exporting}
            />
            <span className="text-xl text-black">ຫາ</span>
            <DatePicker
              selected={searchParams.endDate}
              onChange={(date) => setSearchParams({ ...searchParams, endDate: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="ສິ້ນສຸດ (ວວ/ດດ/ປປປປ)"
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ວັນທີ່ສິ້ນສຸດ"
              disabled={loading || exporting}
            />
            <select
              value={searchParams.status}
              onChange={(e) =>
                setSearchParams({ ...searchParams, status: e.target.value })
              }
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ສະຖານະ"
              disabled={loading || exporting}
            >
              <option value="">ທຸກສະຖານະ</option>
              <option value="pending">ລໍຖ້າການຢືນຢັນ</option>
              <option value="confirmed">ຢືນຢັນແລ້ວ</option>
              <option value="cancelled">ຍົກເລີກ</option>
              <option value="completed">ສຳເລັດ</option>
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
      <div className="w-full max-w-7xl mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          id="booking-report-title"
        >
          ລາຍງານການຈອງ
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table
                className="min-w-full table-auto text-base"
                aria-describedby="booking-report-title"
              >
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ລະຫັດການຈອງ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ຜູ້ຈອງ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ເບີໂທ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ເດີ່ນ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ວັນທີ່ຈອງ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ເວລາ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ລາຄາ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ພະນັກງານຈັດການ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ສະຖານະ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ປະເພດການຈອງ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-t hover:bg-gray-50 transition-all"
                      >
                        <td className="py-3 px-4">{booking.id || '-'}</td>
                        <td className="py-3 px-4">{booking.user_name || '-'}</td>
                        <td className="py-3 px-4">{booking.user_phone || '-'}</td>
                        <td className="py-3 px-4">{booking.stadium_dtail || '-'}</td>
                        <td className="py-3 px-4">
                          {formatDisplayDate(booking.booking_date, false, booking.booking_type)}
                        </td>
                        <td className="py-3 px-4">
                          {formatTimeSlot(booking.time_slot, booking.booking_type)}
                        </td>
                        <td className="py-3 px-4">{formatCurrency(booking.price)}</td>
                        <td className="py-3 px-4">{booking.username || '-'}</td>
                        <td className="py-3 px-4">
                          {booking.status === 'pending'
                            ? 'ລໍຖ້າ'
                            : booking.status === 'confirmed'
                            ? 'ອະນຸມັດ'
                            : booking.status === 'cancelled'
                            ? 'ປະຕິເສດ'
                            : booking.status === 'completed'
                            ? 'ສຳເລັດ'
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {booking.booking_type === 'Football'
                            ? 'ເຕະບານ'
                            : booking.booking_type === 'Event'
                            ? 'ກິດຈະກຳ'
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
                  ຈຳນວນການຈອງທັງໝົດ:{' '}
                  <span className="text-black font-bold">
                    {filteredBookings.length} ລາຍການ
                  </span>
                </p>
                {(searchParams.startDate || searchParams.endDate) && (
                  <p className="text-sm text-gray-600">
                    ຊ່ວງວັນທີ່:{' '}
                    {searchParams.startDate
                      ? formatSearchDisplayDate(searchParams.startDate)
                      : 'ທຸກວັນ'}{' '}
                    -{' '}
                    {searchParams.endDate
                      ? formatSearchDisplayDate(searchParams.endDate)
                      : 'ທຸກວັນ'}
                  </p>
                )}
                {searchParams.status && (
                  <p className="text-sm text-gray-600">
                    ສະຖານະ:{' '}
                    {searchParams.status === 'pending'
                      ? 'ລໍຖ້າການຢືນຢັນ'
                      : searchParams.status === 'confirmed'
                      ? 'ຢືນຢັນແລ້ວ'
                      : searchParams.status === 'cancelled'
                      ? 'ຍົກເລີກ'
                      : searchParams.status === 'completed'
                      ? 'ສຳເລັດ'
                      : '-'}
                  </p>
                )}
                <div className="mt-2">
                  <p className="text-sm text-yellow-500">
                    ລໍຖ້າ:{' '}
                    <span className="text-black">
                      {getStatusCounts().pending} ລາຍການ
                    </span>
                  </p>
                  <p className="text-sm text-green-600">
                    ອະນຸມັດ:{' '}
                    <span className="text-black">
                      {getStatusCounts().confirmed} ລາຍການ
                    </span>
                  </p>
                  <p className="text-sm text-red-600">
                    ປະຕິເສດ:{' '}
                    <span className="text-black">
                      {getStatusCounts().cancelled} ລາຍການ
                    </span>
                  </p>
                  <p className="text-sm text-blue-600">
                    ສຳເລັດ ຫຼື ແຈ້ງເຂົ້າ:{' '}
                    <span className="text-black">
                      {getStatusCounts().completed} ລາຍການ
                    </span>
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