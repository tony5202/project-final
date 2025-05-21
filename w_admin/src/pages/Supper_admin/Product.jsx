import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const Product = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Format number as LAK currency
  const formatCurrency = (value) => {
    return Number(value).toLocaleString('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost:8000/api/product')
      .then((res) => {
        const validData = Array.isArray(res.data) ? res.data : [];
        setProducts(validData);
      })
      .catch((err) => {
        setError('Error fetching products');
        toast.error('Error fetching products');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    if (image) data.append('image', image);

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:8000/api/product/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('ແກແກ້ໄຂສິນຄ້າ!');
      } else {
        await axios.post('http://localhost:8000/api/product', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('ເສິນຄ້າໃໝ່!');
      }

      fetchProducts();
      setFormData({ name: '', category: '', price: '', quantity: '' });
      setImage(null);
      setEditingProduct(null);
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to submit product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
    setImage(null);
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ທ່ານແນ່ໃຈບໍ່?',
      text: 'ສິນຄ້ານີ້ຈະຖືກລົບຢ່າງຖາວອນ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ລົບ!',
      cancelButtonText: 'ຍົກເລີກ'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/product/${id}`);
        toast.success('ສິນຄ້າຖືກລົບແລ້ວ!');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-2xl mt-10 p-6">
        <h2 className="text-4xl font-semibold mb-6 text-center">
          {editingProduct ? 'ແກ້ໄຂສິນຄ້າ' : 'ເພີ່ມສິນຄ້າ'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="ຊື່ ສິນຄ້າ"
            className="w-full px-4 py-3 border rounded-md focus:outline-none"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <select
            name="category"
            className="w-full px-4 py-3 border rounded-md focus:outline-none"
            onChange={handleChange}
            value={formData.category}
            required
          >
            <option value="" disabled>ເລືອກປະເພດສິນຄ້າ</option>
            <option value="ນ້ຳດື່ມ">ນ້ຳດື່ມ</option>
            <option value="ນ້ຳອັດລົມ">ນ້ຳອັດລົມ</option>
            <option value="ເຄື່ອງດື່ມຊູກຳລັງ">ເຄື່ອງດື່ມຊູກຳລັງ</option>
            <option value="ເຄື່ອງດື່ມແອວກໍຮໍ">ເຄື່ອງດື່ມແອວກໍຮໍ</option>
            <option value="ເຄື່ອງດື່ມແຮ່ທາດ">ເຄື່ອງດື່ມແຮ່ທາດ</option>
            <option value="ຂອງຫວານ">ຂອງຫວານ</option>
            <option value="ອາຫານຫວ່າງ">ອາຫານຫວ່າງ</option>
           
          </select>
          <input
            type="number"
            name="price"
            placeholder="ລາຄາ"
            className="w-full px-4 py-3 border rounded-md"
            onChange={handleChange}
            value={formData.price}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="ຈຳນວນ"
            className="w-full px-4 py-3 border rounded-md"
            onChange={handleChange}
            value={formData.quantity}
            required
          />
          <input
            type="file"
            accept="image/*"
            className="w-full py-3 text-lg"
            onChange={handleFileChange}
            required={!editingProduct}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 text-xl"
          >
            {editingProduct ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມສິນຄ້າ'}
          </button>
        </form>
      </div>

      <div className="w-full max-w-7xl mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-semibold text-center mb-8">ຂໍ້ມູນສິນຄ້າ</h1>
        {loading ? (
          <p className="text-center text-gray-500 text-xl">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-xl">{error}</p>
        ) : (
          <table className="min-w-full table-auto text-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left">ຊື່ສິນຄ້າ</th>
                <th className="py-3 px-6 text-left">ປະເພດສິນຄ້າ</th>
                <th className="py-3 px-6 text-left">ລາຄາ</th>
                <th className="py-3 px-6 text-left">ຈຳນວນ</th>
                <th className="py-3 px-6 text-left">ຮູບສິນຄ້າ</th>
                <th className="py-3 px-6 text-left">ເຫດການ</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((item, index) => (
                  <tr key={item.id || index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">{item.category}</td>
                    <td className="py-3 px-6">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-6">{item.quantity}</td>
                    <td className="py-3 px-6">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">ບໍ່ມີຮູບ</div>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
                      >
                        ແກ້ໄຂສິນຄ້າ
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                      >
                        ລົບ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-4">ບໍ່ມີສິນຄ້າ</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Product;