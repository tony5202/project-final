import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaImage, FaFilter, FaSort, FaRedo, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchId, setSearchId] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    setSearchId('');
    setStatusFilter('');
    try {
      const response = await axios.get(`http://localhost:8000/api/bookings?t=${new Date().getTime()}`);
      console.log('ການຕອບກັບຈາກ backend:', response.data);
      const fetchedBookings = Array.isArray(response.data.bookings) ? response.data.bookings : [];
      setBookings(fetchedBookings);
      setLoading(false);
    } catch (err) {
      console.error('ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ:', err);
      setError(err.response?.data?.msg || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    const actionText = status === 'confirmed' ? 'ອະນຸມັດ' : 'ຍົກເລີກ';
    const result = await Swal.fire({
      title: `ທ່ານແນ່ໃຈບໍ່ທີ່ຈະ${actionText}ການຈອງນີ້?`,
      text: `ການ${actionText}ການຈອງນີ້ຈະມີຜົນໃນທັນທີ!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: actionText,
      cancelButtonText: 'ປິດ',
    });

    if (result.isConfirmed) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const emp_id = user?.emp_id;
        if (!emp_id) {
          throw new Error('ບໍ່ພົບ emp_id ຂອງຜູ້ໃຊ້');
        }
        const response = await axios.patch(`http://localhost:8000/api/booking/${bookingId}/status`, { status, emp_id });
        await Swal.fire({
          title: 'ສຳເລັດ!',
          text: response.data.msg,
          icon: 'success',
          confirmButtonColor: '#22c55e',
        });
        fetchBookings();
      } catch (err) {
        await Swal.fire({
          title: 'ຂໍ້ຜິດພາດ!',
          text: err.response?.data?.msg || err.message,
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const openModal = (url) => setModalImage(url);
  const closeModal = () => setModalImage(null);

  const resetFilters = () => {
    setSearchId('');
    setStatusFilter('');
  };

  const getTimeSlotDisplay = (booking) => {
    if (booking.booking_type === 'Event') {
      return 'ໝົດມື້';
    }
    return booking.time_slot || 'N/A';
  };

  const getDisplayDate = (booking) => {
    const bookingDate = new Date(booking.booking_date);
    if (booking.booking_type === 'Event') {
      bookingDate.setDate(bookingDate.getDate() + 1);
    }
    return new Intl.DateTimeFormat('lo-LA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(bookingDate);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    const matchesId = searchId ? String(booking.id).includes(searchId) : true;
    return matchesStatus && matchesId;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-gray-100 min-h-screen">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-10">ຈັດການການຈອງ</h2>
        <div className="text-center py-12 animate-fade-in bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-xl text-red-600 font-semibold mb-6">ຂໍ້ຜິດພາດ: {error}</p>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 mx-auto shadow-md"
            aria-label="ລອງໃໝ່"
          >
            <FaRedo />
            ລອງໃໝ່
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-green-700 mb-10">ຈັດການການຈອງ</h2>

      {/* ການກັ່ນຕອງ, ການຈັດລຽງ, ການຄົ້ນຫາ, ແລະປຸ່ມຣີເຊັດ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <FaSearch className="text-gray-600" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="ຄົ້ນຫາ ID ການຈອງ..."
            className="w-full p-2 border-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md text-base"
            aria-label="ຄົ້ນຫາ ID ການຈອງ"
          />
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <FaFilter className="text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md text-base"
            aria-label="ກັ່ນຕອງຕາມສະຖານະ"
          >
            <option value="">ທັງໝົດ</option>
            <option value="pending">ລໍຖ້າ</option>
            <option value="confirmed">ອະນຸມັດ</option>
            <option value="cancelled">ຍົກເລີກ</option>
          </select>
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md"
          aria-label={`ຈັດລຽງຕາມວັນທີ່ສ້າງ ${sortOrder === 'desc' ? 'ເກົ່າສຸດ' : 'ຫຼ້າສຸດ'}`}
        >
          <FaSort />
          ຈັດລຽງ: {sortOrder === 'desc' ? 'ຫຼ້າສຸດ' : 'ເກົ່າສຸດ'}
        </button>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-md"
          aria-label="ຣີເຊັດການຄົ້ນຫາແລະການກັ່ນຕອງ"
        >
          <FaRedo />
          ຣີເຊັດ
        </button>
      </div>

      {/* ຂໍ້ຄວາມເມື່ອບໍ່ມີຂໍ້ມູນການຈອງ */}
      {sortedBookings.length === 0 ? (
        <div className="text-center py-12 animate-fade-in bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-xl text-gray-600 font-medium mb-6">ບໍ່ພົບການຈອງ</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={fetchBookings}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 shadow-md"
              aria-label="ໂຫຼດຂໍ້ມູນໃໝ່"
            >
              <FaRedo />
              ໂຫຼດຂໍ້ມູນໃໝ່
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ຕາຕະລາງສຳລັບເດສກ໌ທັອບ */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full bg-white border border-gray-200 rounded-xl text-base">
              <thead className="sticky top-0 bg-green-600 text-white z-10">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold min-w-[100px]">ລະຫັດການຈອງ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[120px]">ຊື່ລູກຄ້າ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[120px]">ເບີໂທ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[150px]">ສະໜາມ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[120px]">ຮອບ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[120px]">ວັນທີ່ຈອງ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[100px]">ປະເພດ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[120px]">ລາຄາ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[120px]">ມັດຈຳ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[100px]">ສະລິບ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[100px]">ສະຖານະ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[140px]">ວັນທີ່ກົດຈອງ</th>
                  <th className="py-4 px-6 text-left font-semibold min-w-[180px]">ດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-green-50 transition-colors duration-200 animate-fade-in`}
                  >
                    <td className="py-4 px-6 border-b text-gray-800">{booking.id}</td>
                    <td className="py-4 px-6 border-b text-gray-800">{booking.user_name}</td>
                    <td className="py-4 px-6 border-b text-gray-800">{booking.user_phone}</td>
                    <td className="py-4 px-6 border-b text-gray-800">{booking.stadium_dtail}</td>
                    <td className="py-4 px-6 border-b text-gray-800">{getTimeSlotDisplay(booking)}</td>
                    <td className="py-4 px-6 border-b text-gray-800">{getDisplayDate(booking)}</td>
                    <td className="py-4 px-6 border-b text-gray-800">
                      {booking.booking_type === 'Event' ? 'ຈັດກິດຈະກຳ' : 'ເຕະບານ'}
                    </td>
                    <td className="py-4 px-6 border-b text-gray-800">
                      {booking.price.toLocaleString('lo-LA')} ກີບ
                    </td>
                    <td className="py-4 px-6 border-b text-gray-800">
                      {booking.pre_pay.toLocaleString('lo-LA')} ກີບ
                    </td>
                    <td className="py-4 px-6 border-b">
                      {booking.slip_payment ? (
                        <button
                          onClick={() => openModal(booking.slip_payment)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors duration-200"
                          aria-label="ເບິ່ງສະລິບການຊຳລະ"
                        >
                          <FaImage />
                          ເບິ່ງສະລິບ
                        </button>
                      ) : (
                        <span className="text-gray-500">ບໍ່ມີ</span>
                      )}
                    </td>
                    <td className="py-4 px-6 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status === 'pending'
                          ? 'ລໍຖ້າ'
                          : booking.status === 'confirmed'
                          ? 'ອະນຸມັດ'
                          : booking.status === 'cancelled'
                          ? 'ຍົກເລີກ'
                          : booking.status === 'completed'
                          ? 'ສຳເລັດ'
                          : booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 border-b text-gray-800">
                      {booking.created_at
                        ? new Intl.DateTimeFormat('lo-LA', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(new Date(booking.created_at))
                        : 'ບໍ່ມີຂໍ້ມູນ'}
                    </td>
                    <td className="py-4 px-6 border-b flex gap-3">
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        disabled={['confirmed', 'cancelled', 'completed'].includes(booking.status)}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-sm"
                        aria-label="ອະນຸມັດການຈອງ"
                      >
                        <FaCheckCircle />
                        ອະນຸມັດ
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        disabled={['confirmed', 'cancelled', 'completed'].includes(booking.status)}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-sm"
                        aria-label="ຍົກເລີກການຈອງ"
                      >
                        <FaTimesCircle />
                        ຍົກເລີກ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ກາດສຳລັບມືຖື */}
          <div className="md:hidden space-y-6">
            {sortedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in"
              >
                <div className="grid grid-cols-2 gap-4 text-base">
                  <div className="font-semibold text-gray-700">ID:</div>
                  <div className="text-gray-800">{booking.id}</div>
                  <div className="font-semibold text-gray-700">ຜູ້ໃຊ້:</div>
                  <div className="text-gray-800">{booking.user_name}</div>
                  <div className="font-semibold text-gray-700">ສະໜາມ:</div>
                  <div className="text-gray-800">{booking.stadium_dtail}</div>
                  <div className="font-semibold text-gray-700">ເວລາ:</div>
                  <div className="text-gray-800">{getTimeSlotDisplay(booking)}</div>
                  <div className="font-semibold text-gray-700">ວັນທີ່ຈອງ:</div>
                  <div className="text-gray-800">{getDisplayDate(booking)}</div>
                  <div className="font-semibold text-gray-700">ປະເພດ:</div>
                  <div className="text-gray-800">
                    {booking.booking_type === 'Event' ? 'ຈັດກິດຈະກຳ' : 'ເຕະບານ'}
                  </div>
                  <div className="font-semibold text-gray-700">ລາຄາ:</div>
                  <div className="text-gray-800">{booking.price.toLocaleString('lo-LA')} ກີບ</div>
                  <div className="font-semibold text-gray-700">ມັດຈຳ:</div>
                  <div className="text-gray-800">{booking.pre_pay.toLocaleString('lo-LA')} ກີບ</div>
                  <div className="font-semibold text-gray-700">ສະລິບ:</div>
                  <div>
                    {booking.slip_payment ? (
                      <button
                        onClick={() => openModal(booking.slip_payment)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors duration-200"
                      >
                        <FaImage />
                        ເບິ່ງສະລິບ
                      </button>
                    ) : (
                      <span className="text-gray-500">ບໍ່ມີ</span>
                    )}
                  </div>
                  <div className="font-semibold text-gray-700">ສະຖານະ:</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {booking.status === 'pending'
                        ? 'ລໍຖ້າ'
                        : booking.status === 'confirmed'
                        ? 'ອະນຸມັດ'
                        : booking.status === 'cancelled'
                        ? 'ຍົກເລີກ'
                        : booking.status === 'completed'
                        ? 'ສຳເລັດ'
                        : booking.status}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-700">ສ້າງເມື່ອ:</div>
                  <div className="text-gray-800">
                    {booking.created_at
                      ? new Intl.DateTimeFormat('lo-LA', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(booking.created_at))
                      : 'ບໍ່ມີຂໍ້ຮມູນ'}
                  </div>
                </div>
                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    disabled={['confirmed', 'cancelled', 'completed'].includes(booking.status)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-sm"
                  >
                    <FaCheckCircle />
                    ອະນຸມັດ
                  </button>
                  <button
                    onClick={() => updateStatus(booking.id, 'cancelled')}
                    disabled={['confirmed', 'cancelled', 'completed'].includes(booking.status)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-sm"
                  >
                    <FaTimesCircle />
                    ຍົກເລີກ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ໂມດັລສຳລັບສະແດງສະລິບ */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-zoom-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full">
            <img
              src={modalImage}
              alt="ສະລິບການຊຳລະ"
              className="max-w-full h-auto rounded-lg"
              onError={() => {
                Swal.fire({
                  title: 'ຂໍ້ຜິດພາດ!',
                  text: 'ບໍ່ສາມາດໂຫຼດຮູບສະລິບໄດ້',
                  icon: 'error',
                  confirmButtonColor: '#ef4444',
                });
                closeModal();
              }}
            />
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-md"
            >
              ປິດ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;