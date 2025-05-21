import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Printer } from 'lucide-react';

const SaleProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [receivedMoney, setReceivedMoney] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [saleDetails, setSaleDetails] = useState(null);

  // ดึงข้อมูล emp_id จาก localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const empId = user.emp_id || '';

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
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '/'); // ผลลัพธ์จะเป็น dd/MM/yyyy
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/product');
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch products error:', err);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = (product) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity + 1 > product.quantity) {
        toast.error(`ສິນຄ້າ ${product.name} ມີຈຳນວນໃນສະຕັອກບໍ່ພຽງພໍ`);
        return;
      }
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);
    if (newQuantity > product.quantity) {
      toast.error(`ສິນຄ້າ ${product.name} ມີຈຳນວນໃນສະຕັອກບໍ່ພຽງພໍ`);
      return;
    }
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  useEffect(() => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalAmount(total);
  }, [selectedProducts]);

  const handleSale = async () => {
    if (selectedProducts.length === 0) {
      toast.error('ກະລຸນາເລືອກສິນຄ້າຢ່າງໜ້ອຍໜຶ່ງລາຍການ');
      return;
    }
    if (!receivedMoney || Number(receivedMoney) < totalAmount) {
      toast.error('ກະລຸນາໃສ່ຈຳນວນເງິນທີ່ຮັບມາ ແລະຕ້ອງບໍ່ນ້ອຍກວ່າຍອດທັງໝົດ');
      return;
    }
    if (!empId) {
      toast.error('ບໍ່ພົບລະຫັດພະນັກງານ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const details = selectedProducts.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
        price: product.price,
      }));

      const res = await axios.post('http://localhost:8000/api/sale', {
        totalAmount,
        receivedmoney: Number(receivedMoney),
        emp_id: empId,
        details,
      });

      toast.success('ການຂາຍສຳເລັດ');
      setSaleDetails({
        sale_id: res.data.sale_id,
        totalAmount,
        receivedMoney: Number(receivedMoney),
        change: Number(receivedMoney) - totalAmount,
        date_time: new Date(),
        products: selectedProducts,
        emp_id: empId,
      });
      setShowReceipt(true);

      // รีเฟรชข้อมูลสินค้าหลังการขายสำเร็จ
      await fetchProducts();
    } catch (err) {
      console.error('Sale error:', err);
      toast.error(err.response?.data?.msg || 'ເກີດຂໍ້ຜິດພາດໃນການຂາຍ');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/home');
  };

  const resetSale = () => {
    setSelectedProducts([]);
    setReceivedMoney('');
    setShowReceipt(false);
    setSaleDetails(null);
  };

  return (
    <div className="min-h-screen w-full bg-green-500 flex flex-col items-center font-noto-sans-lao" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/stadium.png)', backgroundSize: 'cover' }}>
      {/* Header Section */}
      <div className="p-6 w-full">
        <button
          className="flex items-center justify-center bg-white text-black hover:bg-gray-200 py-3 px-6 rounded-full transition-all duration-300 shadow-lg border-2 border-black text-lg"
          onClick={handleBack}
          aria-label="ຍ້ອນກັບໜ້າຫຼັກ"
          disabled={loading}
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          ຍ້ອນກັບໜ້າຫຼັກ
        </button>
      </div>

      {/* Sale Section */}
      <div className="w-full h-full flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg shadow-2xl border-4 border-green-600 h-full">
          <h1 className="text-5xl font-bold text-center my-10 text-black bg-green-600 text-white py-4 rounded-t-lg shadow-md">
            ຂາຍສິນຄ້າ
          </h1>

          {/* Product Selection and Selected Products Layout */}
          <div className="flex flex-col lg:flex-row gap-8 px-8 pb-8">
            {/* Product Selection */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-black mb-4 bg-green-500 text-white py-1 px-3 rounded-md">ເລືອກສິນຄ້າ</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 bg-gray-100">
                      <h3 className="text-lg font-bold text-black">{product.name}</h3>
                      <p className="text-sm text-gray-700">ໝວດໝູ່: {product.category}</p>
                      <p className="text-sm text-gray-700">ລາຄາ: {formatCurrency(product.price)}</p>
                      <p className="text-sm text-gray-700">ສະຕັອກ: {product.quantity}</p>
                      <button
                        onClick={() => addProduct(product)}
                        className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 text-base"
                        disabled={loading || product.quantity === 0}
                      >
                        <Plus className="w-4 h-4 mr-2" /> ເພີ່ມ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Products and Total */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-black mb-6 bg-green-500 text-white py-2 px-4 rounded-md">ລາຍການທີ່ເລືອກ</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border-2 border-black rounded-lg shadow-md">
                      <thead>
                        <tr className="bg-green-600 text-white">
                          <th className="py-4 px-6 text-left font-medium text-lg">ຊື່ສິນຄ້າ</th>
                          <th className="py-4 px-6 text-left font-medium text-lg">ຈຳນວນ</th>
                          <th className="py-4 px-6 text-left font-medium text-lg">ລາຄາ/ໜ່ວຍ</th>
                          <th className="py-4 px-6 text-left font-medium text-lg">ລາຄາລວມ</th>
                          <th className="py-4 px-6 text-left font-medium text-lg">ລຶບ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProducts.map((product) => (
                          <tr key={product.id} className="border-t border-black hover:bg-gray-100 transition-all">
                            <td className="py-4 px-6 text-black text-base">{product.name}</td>
                            <td className="py-4 px-6">
                              <input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                                className="w-24 px-3 py-2 border border-black rounded-md focus:ring-2 focus:ring-green-600 text-base"
                                min="1"
                                disabled={loading}
                              />
                            </td>
                            <td className="py-4 px-6 text-black text-base">{formatCurrency(product.price)}</td>
                            <td className="py-4 px-6 text-black text-base">{formatCurrency(product.price * product.quantity)}</td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                                disabled={loading}
                              >
                                <Trash2 className="w-6 h-6" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Total and Payment */}
              <div className="bg-white p-6 border-2 border-black rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-black mb-6">ຊຳລະເງິນ</h2>
                <p className="text-2xl font-bold text-black mb-6">
                  ຍອດທັງໝົດ: {formatCurrency(totalAmount)}
                </p>
                <div className="mb-6">
                  <label className="block text-lg font-medium text-gray-700">ເງິນທີ່ຮັບ:</label>
                  <input
                    type="number"
                    value={receivedMoney}
                    onChange={(e) => setReceivedMoney(e.target.value)}
                    className="mt-2 w-full px-4 py-3 border border-black rounded-md focus:ring-2 focus:ring-green-600 bg-gray-100 text-lg"
                    placeholder="ໃສ່ຈຳນວນເງິນ"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSale}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-full transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed text-xl font-bold"
                  disabled={loading}
                >
                  {loading ? 'ກຳລັງດຳເນີນການ...' : 'ຢືນຢັນການຂາຍ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && saleDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-2xl border-4 border-green-600">
            <h2 className="text-3xl font-bold text-center mb-6 text-black bg-green-600 text-white py-3 rounded-md">ໃບຮັບເງິນ</h2>
            <div className="printable-area">
              {/* Logo Section */}
              <div className="text-center mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/188/188864.png"
                  alt="Store Logo"
                  className="w-24 h-auto mx-auto mb-2"
                />
                <p className="text-lg font-semibold text-black">NATHOM Store</p>
              </div>
              <p className="text-base text-black">ລະຫັດການຂາຍ: {saleDetails.sale_id}</p>
              <p className="text-base text-black">
                ວັນທີ: {formatDate(new Date(saleDetails.date_time))}
              </p>
              <p className="text-base text-black">ພະນັກງານ: {saleDetails.emp_id}</p>
              <hr className="my-3 border-2 border-black" />
              <table className="min-w-full text-base">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="py-2 px-4 text-left">ສິນຄ້າ</th>
                    <th className="py-2 px-4 text-left">ຈຳນວນ</th>
                    <th className="py-2 px-4 text-left">ລາຄາ</th>
                    <th className="py-2 px-4 text-left">ລວມ</th>
                  </tr>
                </thead>
                <tbody>
                  {saleDetails.products.map((product) => (
                    <tr key={product.id} className="border-t border-black">
                      <td className="py-2 px-4 text-black">{product.name}</td>
                      <td className="py-2 px-4 text-black">{product.quantity}</td>
                      <td className="py-2 px-4 text-black">{formatCurrency(product.price)}</td>
                      <td className="py-2 px-4 text-black">{formatCurrency(product.price * product.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr className="my-3 border-2 border-black" />
              <p className="text-base text-black">ຍອດທັງໝົດ: {formatCurrency(saleDetails.totalAmount)}</p>
              <p className="text-base text-black">ເງິນທີ່ຮັບ: {formatCurrency(saleDetails.receivedMoney)}</p>
              <p className="text-base text-black">ເງິນທອນ: {formatCurrency(saleDetails.change)}</p>
              <p className="text-center text-base text-black mt-3">ຂອບໃຈລູກຄ້າທີ່ໃຊ້ບໍລິການທາງເດີ່ນາທົ່ມ</p>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={printReceipt}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full flex items-center transition-colors duration-300 text-lg"
              >
                <Printer className="w-5 h-5 mr-2" /> ພິມໃບຮັບເງິນ
              </button>
              <button
                onClick={resetSale}
                className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-8 rounded-full text-lg"
              >
                ປິດ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for Printing */}
      <style>
        {`
          @media print {
            @page {
              size: A4; /* กำหนดขนาดกระดาษเป็น A4 */
              margin: 0; /* ลบ margin ของหน้า */
            }
            body * {
              visibility: hidden;
            }
            .printable-area,
            .printable-area * {
              visibility: visible;
            }
            .printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm; /* ความกว้างของ A4 */
              height: auto; /* ปรับความสูงให้เหมาะสมกับเนื้อหา */
              padding: 15mm; /* padding สำหรับขอบ */
              font-size: 12pt; /* ลดขนาดฟอนต์เพื่อให้กะทัดรัด */
              background: white;
              border: none; /* ลบ border เพื่อให้ดูสะอาด */
              box-sizing: border-box;
            }
            /* ปิด header/footer ของเบราว์เซอร์ */
            @page {
              margin-top: 0;
              margin-bottom: 0;
            }
            /* ป้องกันการแบ่งหน้า */
            .printable-area {
              page-break-inside: avoid;
              page-break-before: auto;
              page-break-after: auto;
            }
            /* ปรับขนาดตารางให้เหมาะสม */
            .printable-area table {
              width: 100%;
              table-layout: fixed;
            }
            .printable-area th,
            .printable-area td {
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
          }
        `}
      </style>

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

export default SaleProduct;