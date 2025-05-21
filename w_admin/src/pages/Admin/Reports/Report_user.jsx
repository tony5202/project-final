import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const Report_user = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/users');
      console.log('Fetched users:', res.data);
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຜູ້ໃຊ້');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const exportToExcel = async () => {
    if (users.length === 0) {
      toast.warn('ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້ສຳລັບສົ່ງອອກ');
      return;
    }

    setExporting(true);
    try {
      console.log('Starting Excel export');
      const headers = ['ຊື່ຜູ້ໃຊ້', 'ຊື່', 'ອີເມວ', 'ເບີໂທ'];
      const data = users.map(user => [
        user.username || '-',
        user.name || '-',
        user.email || '-',
        user.phone || '-'
      ]);

      // Add empty row for spacing
      const spacer = ['', '', '', ''];
      // Add total users row
      const totalRow = ['', '', 'ຈຳນວນຜູ້ໃຊ້ທັງໝົດ', `${users.length} ຄົນ`];

      // Combine all rows
      const sheetData = [headers, ...data, spacer, totalRow];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

      // Auto-size columns
      const colWidths = headers.map((header, i) => ({
        wch: Math.max(
          header.length,
          ...data.map(row => (row[i] ? row[i].toString().length : 0)),
          totalRow[i] ? totalRow[i].toString().length : 0
        ) + 2
      }));
      worksheet['!cols'] = colWidths;

      // Generate filename with current date
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const fileName = `user_report_${dateStr}.xlsx`;

      // Export to Excel
      XLSX.writeFile(workbook, fileName);
      toast.success('ສົ່ງອອກຂໍ້ມູນຜູ້ໃຊ້ເປັນ Excel ສຳເລັດ');
      console.log('Excel export completed');
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
      <p className="text-lg font-semibold text-gray-800">
                  ຈຳນວນຜູ້ໃຊ້ທັງໝົດ:{' '}
                  <span className="text-2xl font-bold text-blue-600">{users.length} ຄົນ</span>
                </p>
      {/* Table Section */}
      <div className="w-full max-w-7xl mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800" id="user-report-title">
          ລາຍງານຜູ້ໃຊ້
        </h1>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-base" aria-describedby="user-report-title">
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="py-3 px-4 text-left font-medium" scope="col">ຊື່ຜູ້ໃຊ້</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ຊື່</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ອີເມວ</th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">ເບີໂທ</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-gray-50 transition-all">
                        <td className="py-3 px-4">{user.username || '-'}</td>
                        <td className="py-3 px-4">{user.name || '-'}</td>
                        <td className="py-3 px-4">{user.email || '-'}</td>
                        <td className="py-3 px-4">{user.phone || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {users.length > 0 && (
              <div className="mt-6 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ຈຳນວນຜູ້ໃຊ້ທັງໝົດ:{' '}
                  <span className="text-2xl font-bold text-blue-600">{users.length} ຄົນ</span>
                </p>
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

export default Report_user;