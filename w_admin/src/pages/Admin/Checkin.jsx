import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, CreditCard, Loader2, ArrowLeft } from "lucide-react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Checkin = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [checkinId, setCheckinId] = useState(null);
  const [postPay, setPostPay] = useState("");
  const [customerPay, setCustomerPay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Set default searchDate to current date in YYYY-MM-DD for input type="date"
  const currentDate = new Date();
  const defaultDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const [searchDate, setSearchDate] = useState(defaultDate);
  const [searchId, setSearchId] = useState(""); // New state for booking ID search

  // Format number as LAK currency
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format time slot for display
  const getTimeSlotDisplay = (booking) => {
    if (booking.booking_type === 'Event') {
      return 'ໝົດມື້';
    }
    return booking.time_slot || 'N/A';
  };

  // Format booking date for display
  const getDisplayDate = (booking) => {
    // booking_date is in DD/MM/YYYY format
    const [day, month, year] = booking.booking_date.split('/');
    let date = new Date(`${year}-${month}-${day}`);
    if (booking.booking_type === 'Event') {
      date.setDate(date.getDate() + 1);
    }
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Fetch all confirmed bookings and filter by date and ID
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/bookings/confirmed");
        const bookings = response.data.bookings || [];
        setBookings(bookings);
        // Convert searchDate (YYYY-MM-DD) to DD/MM/YYYY for filtering
        const [year, month, day] = searchDate.split('-');
        const formattedSearchDate = `${day}/${month}/${year}`;
        // Calculate the previous day for Event bookings
        const searchDateObj = new Date(`${year}-${month}-${day}`);
        searchDateObj.setDate(searchDateObj.getDate() - 1);
        const previousDay = `${String(searchDateObj.getDate()).padStart(2, '0')}/${String(searchDateObj.getMonth() + 1).padStart(2, '0')}/${searchDateObj.getFullYear()}`;
        // Filter bookings by date and ID
        const filtered = bookings.filter((booking) => {
          const dateMatch = booking.booking_type === 'Event'
            ? booking.booking_date.toLowerCase().includes(previousDay.toLowerCase())
            : booking.booking_date.toLowerCase().includes(formattedSearchDate.toLowerCase());
          const idMatch = searchId
            ? String(booking.id).toLowerCase().includes(searchId.toLowerCase())
            : true;
          return dateMatch && idMatch;
        });
        setFilteredBookings(filtered);
        setError("");
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.msg || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການຈອງ");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [searchDate, searchId]);

  // Handle date search
  const handleSearch = (e) => {
    setSearchDate(e.target.value);
  };

  // Handle ID search
  const handleIdSearch = (e) => {
    setSearchId(e.target.value);
  };

  // Handle booking selection
  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setCheckinId(booking.checkin_id);
    const remainingPay = booking.price - booking.pre_pay;
    setPostPay(remainingPay > 0 ? remainingPay.toFixed(2) : "");
    setCustomerPay("");
    setError("");
    setSuccess("");
  };

  // Handle check-in initiation
  const handleCheckIn = async () => {
    if (!selectedBooking) {
      setError("ກະລຸນາເລືອກການຈອງ");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:8000/api/checkin", {
        booking_id: selectedBooking.id,
        user_id: selectedBooking.user_id,
        st_id: selectedBooking.st_id,
      });
      console.log('Check-in response:', response.data);
      setCheckinId(response.data.checkin_id);
      setSuccess("ແຈ້ງເຂົ້າສະໜາມສຳເລັດ! ກະລຸນາຊຳລະເງິນ");
      // Refresh bookings
      const bookingsResponse = await axios.get("http://localhost:8000/api/bookings/confirmed");
      const bookings = bookingsResponse.data.bookings || [];
      setBookings(bookings);
      // Reapply date filter
      const [year, month, day] = searchDate.split('-');
      const formattedSearchDate = `${day}/${month}/${year}`;
      // Calculate the previous day for Event bookings
      const searchDateObj = new Date(`${year}-${month}-${day}`);
      searchDateObj.setDate(searchDateObj.getDate() - 1);
      const previousDay = `${String(searchDateObj.getDate()).padStart(2, '0')}/${String(searchDateObj.getMonth() + 1).padStart(2, '0')}/${searchDateObj.getFullYear()}`;
      // Filter bookings
      const filtered = bookings.filter((booking) => {
        const dateMatch = booking.booking_type === 'Event'
          ? booking.booking_date.toLowerCase().includes(previousDay.toLowerCase())
          : booking.booking_date.toLowerCase().includes(formattedSearchDate.toLowerCase());
        const idMatch = searchId
          ? String(booking.id).toLowerCase().includes(searchId.toLowerCase())
          : true;
        return dateMatch && idMatch;
      });
      setFilteredBookings(filtered);
    } catch (err) {
      console.error('Error during check-in:', err);
      setError(err.response?.data?.msg || "ເກີດຂໍ້ຜິດພາດໃນການແຈ້ງເຂົ້າ");
    } finally {
      setLoading(false);
    }
  };

  // Handle payment submission and confirmation
  const handlePayment = async () => {
    if (!customerPay) {
      setError("ກະລຸນາປ້ອນຈຳນວນເງິນຈາກລູກຄ້າ");
      return;
    }
    const postPayNum = Number(postPay);
    const customerPayNum = Number(customerPay);
    if (customerPayNum < postPayNum) {
      setError("ຈຳນວນເງິນຈາກລູກຄ້າຕ້ອງບໍ່ຕ່ຳກວ່າຍອດທີ່ຕ້ອງຊຳລະ");
      return;
    }
    if (!checkinId) {
      setError("ກະລຸນາແຈ້ງເຂົ້າກ່ອນດຳເນີນການຊຳລະ");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      console.log('Sending payment request:', { booking_id: selectedBooking.id, post_pay: postPayNum.toFixed(2) });
      const response = await axios.post("http://localhost:8000/api/payment", {
        booking_id: selectedBooking.id,
        post_pay: parseFloat(postPayNum.toFixed(2)),
      });
      console.log('Payment response:', response.data);

      // Show SweetAlert2 for confirmation
      const status = 'confirmed';
      const actionText = status === 'confirmed' ? 'ອະນຸມັດ' : 'ຍົກເລີກ';
      const result = await Swal.fire({
        title: `ທ່ານແນ່ໃຈບໍ່ທີ່ຈະ${actionText}ການແຈ້ງເຂົ້ານີ້?`,
        text: `ການ${actionText}ການແຈ້ງເຂົ້ານີ້ຈະມີຜົນໃນທັນທີ!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: actionText,
        cancelButtonText: 'ປິດ',
      });

      if (!result.isConfirmed) {
        setSuccess("ຊຳລະເງິນສຳເລັດ! ການຢືນຢັນຖືກຍົກເລີກ");
        setPostPay("");
        setCustomerPay("");
        setLoading(false);
        return;
      }

      // Proceed with check-in confirmation
      console.log('Confirming check-in:', checkinId);
      const confirmResponse = await axios.patch(`http://localhost:8000/api/checkin/${checkinId}/confirm`);
      console.log('Confirm check-in response:', confirmResponse.data);
      setSuccess("ຢືນຢັນການແຈ້ງເຂົ້າສຳເລັດ! ການຈອງສຮຮືດແລ້ວ");
      setSelectedBooking(null);
      setCheckinId(null);
      setPostPay("");
      setCustomerPay("");
      // Refresh bookings
      const bookingsResponse = await axios.get("http://localhost:8000/api/bookings/confirmed");
      const bookings = bookingsResponse.data.bookings || [];
      setBookings(bookings);
      // Reapply date filter
      const [year, month, day] = searchDate.split('-');
      const formattedSearchDate = `${day}/${month}/${year}`;
      // Calculate the previous day for Event bookings
      const searchDateObj = new Date(`${year}-${month}-${day}`);
      searchDateObj.setDate(searchDateObj.getDate() - 1);
      const previousDay = `${String(searchDateObj.getDate()).padStart(2, '0')}/${String(searchDateObj.getMonth() + 1).padStart(2, '0')}/${searchDateObj.getFullYear()}`;
      // Filter bookings
      const filtered = bookings.filter((booking) => {
        const dateMatch = booking.booking_type === 'Event'
          ? booking.booking_date.toLowerCase().includes(previousDay.toLowerCase())
          : booking.booking_date.toLowerCase().includes(formattedSearchDate.toLowerCase());
        const idMatch = searchId
          ? String(booking.id).toLowerCase().includes(searchId.toLowerCase())
          : true;
        return dateMatch && idMatch;
      });
      setFilteredBookings(filtered);
    } catch (err) {
      console.error('Error during payment or confirmation:', err);
      if (err.response?.status === 404) {
        setError("ບໍ່ພົບ API ການຊຳລະເງິນຫຼືການຢືນຢັນ ກະລຸນາກວດສອບເຊີບເວີ");
      } else {
        setError(err.response?.data?.msg || "ເກີດຂໍ້ຜິດພາດໃນການຊຳລະເງິນຫຼືຢືນຢັນ");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate change
  const calculateChange = () => {
    const postPayNum = Number(postPay) || 0;
    const customerPayNum = Number(customerPay) || 0;
    return customerPayNum >= postPayNum ? customerPayNum - postPayNum : 0;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-600 to-green-800 px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="w-full max-w-7xl">
        {/* Back to Home Button */}
        <div className="p-4">
          <button
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 font-noto-sans-lao"
            onClick={() => navigate("/home")}
            aria-label="ກັບໄປໜ້າຫຼັກ"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ຍ້ອນກັບໜ້າຫຼັກ
          </button>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 font-noto-sans-lao drop-shadow-lg text-center">
          ແຈ້ງເຂົ້າສະໜາມ
        </h2>
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 sm:p-8 w-full">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 font-noto-sans-lao">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 font-noto-sans-lao">
              {success}
            </div>
          )}

          {/* Search by Date and ID */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 font-noto-sans-lao">
              ຄົ້ນຫາດ້ວຍວັນທີ່ຈອງ
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={handleSearch}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 font-noto-sans-lao"
              disabled={loading}
              aria-label="ເລືອກວັນທີ່ຈອງ"
            />
            <label className="block text-gray-700 font-semibold mt-4 mb-2 font-noto-sans-lao">
              ຄົ້ນຫາດ້ວຍລະຫັດການຈອງ
            </label>
            <input
              type="text"
              value={searchId}
              onChange={handleIdSearch}
              placeholder="ປ້ອນລະຫັດການຈອງ..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 font-noto-sans-lao"
              disabled={loading}
              aria-label="ປ້ອນລະຫັດການຈອງ"
            />
          </div>

          {/* Bookings Table */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 font-noto-sans-lao">
              ລາຍການການຈອງທີ່ຢືນຢັນ
            </label>
            {loading && !filteredBookings.length ? (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <p className="text-gray-600 font-noto-sans-lao">
                ບໍ່ພົບການຈອງທີ່ຢືນຢັນ ກະລຸນາຈອງສະໜາມກ່ອນ
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-green-600 text-white font-noto-sans-lao">
                      <th scope="col" className="p-3 text-left min-w-[150px]">ລະຫັດການຈອງ</th>
                      <th scope="col" className="p-3 text-left min-w-[150px]">ຜູ້ຈອງ</th>
                      <th scope="col" className="p-3 text-left min-w-[200px]">ສະໜາມ</th>
                      <th scope="col" className="p-3 text-left min-w-[120px]">ເວລາ</th>
                     
                      <th scope="col" className="p-3 text-left min-w-[100px]">ລາຄາ</th>
                      <th scope="col" className="p-3 text-left min-w-[100px]">ມັດຈຳ</th>
                      <th scope="col" className="p-3 text-left min-w-[150px]">ຍອດທີ່ຕ້ອງຊຳລະ</th>
                    
                      <th scope="col" className="p-3 text-left min-w-[80px]">ເລືອກ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className={`border-b hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${
                          selectedBooking?.id === booking.id ? "bg-green-100" : ""
                        }`}
                        onClick={() => handleSelectBooking(booking)}
                      >
                        <td className="p-3 font-noto-sans-lao break-words">{booking.id}</td>
                        <td className="p-3 font-noto-sans-lao break-words">{booking.user_name}</td>
                        <td className="p-3 font-noto-sans-lao break-words">{booking.stadium_dtail}</td>
                        <td className="p-3 font-noto-sans-lao">{getTimeSlotDisplay(booking)}</td>
                      
                        <td className="p-3 font-noto-sans-lao">{formatCurrency(booking.price)}</td>
                        <td className="p-3 font-noto-sans-lao">{formatCurrency(booking.pre_pay)}</td>
                        <td className="p-3 font-noto-sans-lao">
                          {formatCurrency(booking.price - booking.pre_pay)}
                        </td>
                      
                        <td className="p-3">
                          <input
                            type="radio"
                            name="selectedBooking"
                            checked={selectedBooking?.id === booking.id}
                            onChange={() => handleSelectBooking(booking)}
                            className="w-5 h-5 text-green-600"
                            aria-label={`ເລືອກການຈອງ ${booking.id}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Display remaining payment before check-in */}
          {selectedBooking && !checkinId && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 font-noto-sans-lao">
                ຍອດທີ່ຕ້ອງຊຳລະກ່ອນແຈ້ງເຂົ້າ
              </label>
              <p className="text-lg font-semibold text-green-700 font-noto-sans-lao">
                {formatCurrency(selectedBooking.price - selectedBooking.pre_pay)}
              </p>
            </div>
          )}

          {/* Check-in Button */}
          {filteredBookings.length > 0 && (
            <button
              onClick={handleCheckIn}
              disabled={loading || !selectedBooking || checkinId}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-noto-sans-lao font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 mb-4"
              aria-label="ແຈ້ງເຂົ້າສະໜາມ"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              ແຈ້ງເຂົ້າສະໜາມ
            </button>
          )}

          {/* Payment Section */}
          {checkinId && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 font-noto-sans-lao">
                ຊຳລະເງິນ
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 mb-1 font-noto-sans-lao">
                    ຍອດທີ່ຕ້ອງຊຳລະ
                  </label>
                  <p
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 font-noto-sans-lao"
                    aria-label="ຍອດທີ່ຕ້ອງຊຳລະ (LAK)"
                  >
                    {formatCurrency(postPay)}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-noto-sans-lao">
                    ຈຳນວນເງິນຈາກລູກຄ້າ
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={customerPay}
                    onChange={(e) => setCustomerPay(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 font-noto-sans-lao"
                    disabled={loading}
                    aria-label="ປ້ອນຈຳນວນເງິນຈາກລູກຄ້າ (LAK)"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-600 mb-1 font-noto-sans-lao">
                    ເງິນທອນ
                  </label>
                  <p className="text-lg font-semibold text-blue-700 font-noto-sans-lao">
                    {formatCurrency(calculateChange())}
                  </p>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={loading || !postPay || !customerPay}
                  className="sm:col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-noto-sans-lao font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="ບັນທຶກການຊຳລະ"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                  ບັນທຶກການຊຳລະ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkin;