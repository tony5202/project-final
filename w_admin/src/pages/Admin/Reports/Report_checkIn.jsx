import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Download, Search, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format, addDays } from 'date-fns';

const Report_checkIn = () => {
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState([]);
  const [filteredCheckins, setFilteredCheckins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [stadiumId, setStadiumId] = useState('');

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr, isCheckinDate = false) => {
    if (!dateStr) return '-';
    try {
      // Handle ISO date strings by extracting yyyy-MM-dd
      const normalizedDateStr = dateStr.split('T')[0];
      const date = parse(normalizedDateStr, 'yyyy-MM-dd', new Date());
      if (isNaN(date)) return '-';
      // For checkin_date, display as-is; for others, add 1 day
      const displayDate = isCheckinDate ? date : addDays(date, 1);
      return format(displayDate, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date parsing error:', error, 'Input:', dateStr);
      return '-';
    }
  };

  const formatSearchDisplayDate = (date) => {
    if (!date) return '-';
    try {
      // Increment selected date by 1 day for display
      const incrementedDate = addDays(date, 1);
      return format(incrementedDate, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Search date formatting error:', error);
      return '-';
    }
  };

  const fetchCheckIns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/checkin');
      console.log('Fetched check-ins:', res.data);
      setCheckins(res.data.checkins);
      setFilteredCheckins(res.data.checkins);
    } catch (err) {
      console.error('Fetch check-ins error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການແຈ້ງເຂົ້າ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckIns();
  }, [fetchCheckIns]);

  // Get unique stadiums for dropdown
  const getUniqueStadiums = useCallback(() => {
    const stadiumMap = new Map();
    checkins.forEach(checkin => {
      if (checkin.st_id && checkin.stadium_dtail) {
        stadiumMap.set(checkin.st_id, checkin.stadium_dtail);
      }
    });
    return Array.from(stadiumMap, ([st_id, dtail]) => ({ st_id, dtail }))
      .sort((a, b) => a.dtail.localeCompare(b.dtail));
  }, [checkins]);

  const filterCheckIns = useCallback(() => {
    if (!startDate && !endDate && !stadiumId) {
      setFilteredCheckins(checkins);
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error('ວັນທີເລີ່ມຕ້ອງບໍ່ຫຼັງວັນທີສິ້ນສຸດ');
      return;
    }

    // Use selected date directly for filtering
    const start = startDate ? formatDate(startDate) : null;
    const end = endDate ? formatDate(endDate) : null;

    const filtered = checkins.filter((checkin) => {
      const checkinDate = checkin.checkin_date.split('T')[0];
      if (start && checkinDate < start) return false;
      if (end && checkinDate > end) return false;
      if (stadiumId && checkin.st_id !== parseInt(stadiumId)) return false;
      return true;
    });

    setFilteredCheckins(filtered);
  }, [startDate, endDate, stadiumId, checkins]);

  useEffect(() => {
    if (startDate || endDate || stadiumId) {
      filterCheckIns();
    } else {
      setFilteredCheckins(checkins);
    }
  }, [startDate, endDate, stadiumId, checkins, filterCheckIns]);

  const handleSearch = () => {
    filterCheckIns();
    toast.success('ຄົ້ນຫາຂໍ້ມູນການແຈ້ງເຂົ້າສຳເລັດ');
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setStadiumId('');
    setFilteredCheckins(checkins);
    toast.info('ລ້າງຂໍ້ມູນການຄົ້ນຫາສຳເລັດ');
  };

  const exportToExcel = async () => {
    if (filteredCheckins.length === 0) {
      toast.warn('ບໍ່ມີຂໍ້ມູນການແຈ້ງເຂົ້າສຳລັບສົ່ງອອກ');
      return;
    }

    setExporting(true);
    try {
      const headers = [
        'ລະຫັດການຈອງ',
        'ຜູ້ໃຊ້',
        'ເດີ່ນ',
        'ລາຄາເດີ່ນ',
        'ວັນທີແຈ້ງເຂົ້າ',
        'ວັນທີຈອງ',
        'ສະຖານະ'
      ];
      const data = filteredCheckins.map(checkin => [
        checkin.book_id,
        checkin.user_name || '-',
        checkin.stadium_dtail || '-',
        formatCurrency(checkin.stadium_price),
        formatDisplayDate(checkin.checkin_date, true),
        formatDisplayDate(checkin.booking_date),
        checkin.status || '-'
      ]);

      const spacer = ['', '', '', '', '', '', ''];
      const totalRow = ['', '', '', 'ຈຳນວນການແຈ້ງເຂົ້າທັງໝົດ', filteredCheckins.length, '', ''];
      const dateRangeRow = startDate && endDate ? [
        '', '', '', 'ຊ່ວງວັນທີ',
        `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
        '', ''
      ] : null;
      const stadiumRow = stadiumId ? [
        '', '', '', 'ເດີ່ນ',
        checkins.find(c => c.st_id === parseInt(stadiumId))?.stadium_dtail || '-',
        '', ''
      ] : null;

      const sheetData = [
        headers,
        ...data,
        spacer,
        totalRow,
        ...(dateRangeRow ? [dateRangeRow] : []),
        ...(stadiumRow ? [stadiumRow] : [])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'CheckIns');

      const colWidths = headers.map((header, i) => ({
        wch: Math.max(
          header.length,
          ...data.map(row => (row[i] ? row[i].toString().length : 0)),
          totalRow[i] ? totalRow[i].toString().length : 0,
          dateRangeRow && dateRangeRow[i] ? dateRangeRow[i].toString().length : 0,
          stadiumRow && stadiumRow[i] ? stadiumRow[i].toString().length : 0
        ) + 2
      }));
      worksheet['!cols'] = colWidths;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const fileName = `checkin_report_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success('ສົ່ງອອກຂໍ້ມູນການແຈ້ງເຂົ້າເປັນ Excel ສຳເລັດ');
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
      {/* Header Section */}
      <div className="p-4 space-y-3 w-full max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <button
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
            onClick={handleBack}
            aria-label="ຍ້ອນກັບໜ້າຫຼັກ"
            disabled={loading || exporting}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ຍ້ອນກັບໜ້າຫຼັກ
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">ຄົ້ນຫາຕາມຊ່ວງວັນທີ ແລະ ເດີ່ນ</h2>
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
              value={stadiumId}
              onChange={(e) => setStadiumId(e.target.value)}
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ເດີ່ນ"
              disabled={loading || exporting}
            >
              <option value="">ທຸກເດີ່ນ</option>
              {getUniqueStadiums().map((stadium) => (
                <option key={stadium.st_id} value={stadium.st_id}>
                  {stadium.dtail}
                </option>
              ))}
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
                disabled={loading || exporting || (!startDate && !endDate && !stadiumId)}
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
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800" id="checkin-report-title">
          ລາຍງານການແຈ້ງເຂົ້າ
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-base" aria-describedby="checkin-report-title">
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="py-3 px-4 text-left font-medium" scope="col">ລະຫັດການຈອງ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ຜູ້ໃຊ້</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ເດີ່ນ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ລາຄາເດີ່ນ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ວັນທີແຈ້ງເຂົ້າ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ວັນທີຈອງ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ສະຖານະ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCheckins.length > 0 ? (
                    filteredCheckins.map((checkin) => (
                      <tr key={checkin.checkin_id} className="border-t hover:bg-gray-50 transition-all">
                        <td className="py-3 px-4">{checkin.book_id}</td>
                        <td className="py-3 px-4">{checkin.user_name || '-'}</td>
                        <td className="py-3 px-4">{checkin.stadium_dtail || '-'}</td>
                        <td className="py-3 px-4">{formatCurrency(checkin.stadium_price)}</td>
                        <td className="py-3 px-4">{formatDisplayDate(checkin.checkin_date, true)}</td>
                        <td className="py-3 px-4">{formatDisplayDate(checkin.booking_date)}</td>
                        <td className="py-3 px-4">{checkin.status || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        ບໍ່ພົບຂໍ້ມູນການແຈ້ງເຂົ້າ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredCheckins.length > 0 && (
              <div className="mt-6 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ຈຳນວນການແຈ້ງເຂົ້າທັງໝົດ:{' '}
                  <span className="text-blue-600 font-bold text-2xl">
                    {filteredCheckins.length}
                  </span>
                </p>
                {startDate && endDate && (
                  <p className="text-sm text-gray-600">
                    ຊ່ວງວັນທີ: {format(startDate, 'dd/MM/yyyy')} - {format(endDate, 'dd/MM/yyyy')}
                  </p>
                )}
                {stadiumId && (
                  <p className="text-sm text-gray-600">
                    ເດີ່ນ: {checkins.find(c => c.st_id === parseInt(stadiumId))?.stadium_dtail || '-'}
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

export default Report_checkIn;