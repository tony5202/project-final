import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Download, Search, X } from 'lucide-react';
import * as XLSX from 'xlsx';

const Report_product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Format price as LAK currency
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/products');
      console.log('Fetched products:', res.data);
      const validData = Array.isArray(res.data) ? res.data : [];
      setProducts(validData);
      setFilteredProducts(validData); // Initialize filteredProducts with all products
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    if (!selectedCategory) {
      setFilteredProducts(products);
      toast.info('ກະລຸນາເລືອກປະເພດສິນຄ້າ');
      return;
    }

    const filtered = products.filter(
      (product) => product.category === selectedCategory
    );
    setFilteredProducts(filtered);
    toast.success('ຄົ້ນຫາສິນຄ້າສຳເລັດ');
  };

  const handleClear = () => {
    setSelectedCategory('');
    setFilteredProducts(products);
    toast.info('ລ້າງຂໍ້ມູນການຄົ້ນຫາສຳເລັດ');
  };

  const exportToExcel = async () => {
    if (filteredProducts.length === 0) {
      toast.warn('ບໍ່ມີຂໍ້ມູນສິນຄ້າສຳລັບສົ່ງອອກ');
      return;
    }

    setExporting(true);
    try {
      console.log('Starting Excel export');
      const headers = ['ຊື່ສິນຄ້າ', 'ປະເພດສິນຄ້າ', 'ລາຄາ', 'ຈຳນວນ'];
      const data = filteredProducts.map((product) => [
        product.name || '-',
        product.category || '-',
        formatCurrency(product.price),
        product.quantity !== null ? product.quantity : '-',
      ]);

      // Add empty row for spacing
      const spacer = ['', '', '', ''];
      // Add total products row
      const totalRow = [
        '',
        '',
        'ຈຳນວນສິນຄ້າທັງໝົດ',
        `${filteredProducts.length} ລາຍການ`,
      ];
      // Add category filter row if a category is selected
      const categoryRow = selectedCategory
        ? ['', '', 'ປະເພດສິນຄ້າ', selectedCategory]
        : null;

      // Combine all rows
      const sheetData = [
        headers,
        ...data,
        spacer,
        totalRow,
        ...(categoryRow ? [categoryRow] : []),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // Auto-size columns
      const colWidths = headers.map((header, i) => ({
        wch: Math.max(
          header.length,
          ...data.map((row) => (row[i] ? row[i].toString().length : 0)),
          totalRow[i] ? totalRow[i].toString().length : 0,
          categoryRow && categoryRow[i] ? categoryRow[i].toString().length : 0
        ) + 2,
      }));
      worksheet['!cols'] = colWidths;

      // Generate filename with current date
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const fileName = `product_report_${dateStr}.xlsx`;

      // Export to Excel
      XLSX.writeFile(workbook, fileName);
      toast.success('ສົ່ງອອກຂໍ້ມູນສິນຄ້າເປັນ Excel ສຳເລັດ');
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
                  ຈຳນວນສິນຄ້າທັງໝົດ:{' '}
                  <span className="text-black font-bold text-2xl">
                    {filteredProducts.length} ລາຍການ
                  </span>
                </p>

      {/* Search Section */}
      <div className="w-full max-w-7xl mt-4 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ຄົ້ນຫາຕາມປະເພດສິນຄ້າ
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              aria-label="ປະເພດສິນຄ້າ"
            >
              <option value="">ສິນຄ້າທັງໝົດ</option>
              <option value="ນ້ຳດື່ມ">ນ້ຳດື່ມ</option>
              <option value="ນ້ຳອັດລົມ">ນ້ຳອັດລົມ</option>
              <option value="ເຄື່ອງດື່ມຊູກຳລັງ">ເຄື່ອງດື່ມຊູກຳລັງ</option>
              <option value="ເຄື່ອງດື່ມແອວກໍຮໍ">ເຄື່ອງດື່ມແອວກໍຮໍ</option>
              <option value="ເຄື່ອງດື່ມແຮ່ທາດ">ເຄື່ອງດື່ມແຮ່ທາດ</option>
              <option value="ຂອງຫວານ">ຂອງຫວານ</option>
              <option value="ອາຫານຫວ່າງ">ອາຫານຫວ່າງ</option>
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
                disabled={loading || exporting || !selectedCategory}
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
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800" id="product-report-title">
          ລາຍງານສິນຄ້າ
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
                aria-describedby="product-report-title"
              >
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ຊື່ສິນຄ້າ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ປະເພດສິນຄ້າ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ລາຄາ
                    </th>
                    <th className="py-3 px-4 text-left font-medium" scope="col">
                      ຈຳນວນ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t hover:bg-gray-50 transition-all"
                      >
                        <td className="py-3 px-4">{product.name || '-'}</td>
                        <td className="py-3 px-4">{product.category || '-'}</td>
                        <td className="py-3 px-4">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="py-3 px-4">
                          {product.quantity !== null ? product.quantity : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        ບໍ່ມີຂໍ້ມູນສິນຄ້າ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredProducts.length > 0 && (
              <div className="mt-6 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ຈຳນວນສິນຄ້າທັງໝົດ:{' '}
                  <span className="text-black font-bold text-2xl">
                    {filteredProducts.length} ລາຍການ
                  </span>
                </p>
                {selectedCategory && (
                  <p className="text-sm text-gray-600">
                    ປະເພດສິນຄ້າ: {selectedCategory}
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

export default Report_product;