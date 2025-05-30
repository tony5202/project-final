import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Simple component replacements (unchanged)
const Input = (props) => <input className="w-full p-3 border rounded-lg shadow-sm" {...props} />;
const Button = ({ children, variant, className = "", ...props }) => {
  const variantClasses = {
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  
  return (
    <button 
      className={`px-6 py-3 rounded-md ${variantClasses[variant || "default"]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
const Card = ({ children }) => <div className="border rounded-xl shadow-lg bg-white">{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>;  
const Textarea = (props) => <textarea className="w-full p-3 border rounded-lg shadow-sm" {...props} />;
const Label = ({ children }) => <label className="block font-medium mb-2">{children}</label>;

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p className="mb-8">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          <Button variant="destructive" onClick={onConfirm}>ຢຶນຢັນການປິດ</Button>
        </div>
      </div>
    </div>
  );
};

const Alert = ({ type, message, onClose }) => {
  if (!message) return null;
  
  const typeClasses = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    info: "bg-blue-100 border-blue-500 text-blue-700"
  };
  
  return (
    <div className={`${typeClasses[type]} px-5 py-4 rounded-lg border mb-6 flex justify-between items-center`}>
      <span>{message}</span>
      <button onClick={onClose} className="font-bold text-xl">×</button>
    </div>
  );
};

const Stadium = () => {
  const [stadiums, setStadiums] = useState([]);
  const [form, setForm] = useState({
    price: '',
    price2: '',
    dtail: '',
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disableModal, setDisableModal] = useState({ open: false, id: null });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [filePreview, setFilePreview] = useState(null);
  const [showInactive, setShowInactive] = useState(false); // Toggle for active/inactive stadiums

  const API_URL = 'http://localhost:8000/api/stadium';

  const fetchStadiums = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL); // Fetches active stadiums by default
      setStadiums(res.data);
    } catch (err) {
      console.error('Error fetching stadiums', err);
      setAlert({
        type: 'error',
        message: 'Failed to fetch stadiums. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStadiums();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('price', form.price);
    formData.append('price2', form.price2);
    formData.append('dtail', form.dtail);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setAlert({
          type: 'success',
          message: 'ສຳເລັດ !'
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setAlert({
          type: 'success',
          message: 'ສຳເລັດ !'
        });
      }
      fetchStadiums();
      resetForm();
    } catch (err) {
      console.error('Error saving stadium', err);
      setAlert({
        type: 'error',
        message: `Failed to ${editId ? 'update' : 'create'} stadium. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ price: '', price2: '', dtail: '', image: null });
    setEditId(null);
    setFilePreview(null);
  };

  const handleEdit = (stadium) => {
    setForm({
      price: stadium.price,
      price2: stadium.price2,
      dtail: stadium.dtail,
      image: null,
    });
    setEditId(stadium.st_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDisableConfirm = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/disable/${disableModal.id}`);
      fetchStadiums();
      setAlert({
        type: 'success',
        message: 'ປິດສຳເລັດ !'
      });
    } catch (err) {
      console.error('Error disabling stadium', err);
      setAlert({
        type: 'error',
        message: 'Failed to disable stadium. Please try again.'
      });
    } finally {
      setDisableModal({ open: false, id: null });
      setLoading(false);
    }
  };

  const handleDisable = (id) => {
    setDisableModal({ open: true, id });
  };

  // Optional: Reactivate stadium
  const handleReactivate = async (id) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/reactivate/${id}`);
      fetchStadiums();
      setAlert({
        type: 'success',
        message: 'ເປີດສຳເລັດ !'
      });
    } catch (err) {
      console.error('Error reactivating stadium', err);
      setAlert({
        type: 'error',
        message: 'Failed to reactivate stadium. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">ຈັດການເດີ່ນ</h1>
      
      <Alert 
        type={alert.type} 
        message={alert.message} 
        onClose={() => setAlert({ type: '', message: '' })} 
      />

      <Modal
        isOpen={disableModal.open}
        onClose={() => setDisableModal({ open: false, id: null })}
        onConfirm={handleDisableConfirm}
        title="ຢຶນຢັນການປິດ"
        message="ໝັ້ນໃຈບໍ່ວ່າຈະປິດເດີ່ນນີ້? ສາມາດເປີດໃຊ້ຄືນໄດ້ພາຍຫຼັງ."
      />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">{editId ? 'ແກ້ໄຂເດີ່ນ' : 'ເພີ່ມເດີ່ນ'}</h2>
        
        <div>
          <Label>ລາຄາຈອງເຕະບານ</Label>
          <Input
            type="text"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            required
            placeholder="ລາຄາຈອງເຕະບານ"
          />
        </div>

        <div>
          <Label>ລາຄາຈອງກິດຈະກຳ</Label>
          <Input
            type="text"
            name="price2"
            value={form.price2}
            onChange={handleInputChange}
            required
            placeholder="ລາຄາຈອງກິດຈະກຳ"
          />
        </div>

        <div>
          <Label>ລາຍລະອຽດ</Label>
          <Textarea
            name="dtail"
            value={form.dtail}
            onChange={handleInputChange}
            required
            placeholder="ລາຍລະອຽດ"
            rows={4}
          />
        </div>

        <div>
          <Label>ຮູບເດີ່ນ</Label>
          <Input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          {filePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={filePreview} 
                alt="Preview" 
                className="h-40 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Processing...' : editId ? 'ແກ້ໄຂເດີ່ນ' : 'ເພີ່ມເດີ່ນ'}
          </Button>
          {editId && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              className="w-24"
            >
              ຍົກເລີກ
            </Button>
          )}
        </div>
      </form>

      <hr className="my-10" />

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">ຂໍ້ມູນເດີ່ນທັງໝົດ</h2>
        <Button 
          onClick={fetchStadiums}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loading ? 'ກຳລັງໂຫຼດຂໍ້ມູນຄືນໃໝ່...' : '🔄 ໂຫຼດຂໍ້ມູນຄືນໃໝ່'}
        </Button>
      </div>

      {loading && !stadiums.length ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading stadiums...</p>
        </div>
      ) : stadiums.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-gray-500">ບໍ່ມີຂໍ້ມູນເດີ່ນ !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stadiums.map((stadium) => (
            <Card key={stadium.st_id}>
              <CardContent className="p-6 flex flex-col gap-6">
                <img
                  src={stadium.image}
                  alt="stadium"
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                <div>
                  <p className="font-bold text-2xl">{stadium.dtail}</p>
                  <p className="text-gray-600 text-xl">
                    ລາຄາຈອງເຕະບານ: <span className="font-bold text-green-600">{stadium.price}</span> ກີບ
                  </p>
                  <p className="text-gray-600 text-xl">
                    ລາຄາຈອງກິດຈະກຳ: <span className="font-bold text-green-600">{stadium.price2}</span> ກີບ
                  </p>
                  <p className="text-gray-600 text-xl">
                    ສະຖານະ: <span className={stadium.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                      {stadium.status === 'active' ? 'ເປີດໃຊ້' : 'ປິດໃຊ້'}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between mt-6">
                  <Button className="bg-yellow-500 text-white" onClick={() => handleEdit(stadium)}>
                    ແກ້ໄຂເດີ່ນ
                  </Button>
                  {stadium.status === 'active' ? (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDisable(stadium.st_id)}
                    >
                      ປິດເດີ່ນ
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      onClick={() => handleReactivate(stadium.st_id)}
                    >
                      ເປີດເດີ່ນຄືນ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stadium;