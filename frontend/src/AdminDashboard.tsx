import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
         alert("Session หมดอายุ กรุณา Login ใหม่");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/products', newProduct, getAuthHeader());
      alert('เพิ่มสินค้าสำเร็จ! 🎉');
      setNewProduct({ name: '', price: 0, stock: 0, description: '', imageUrl: '' }); 
      fetchProducts();
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('กรุณา Login ก่อนนะครับ!');
      } else {
        alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า ตรวจสอบข้อมูลให้ถูกต้อง');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('ยืนยันที่จะลบสินค้านี้?')) return;
    try {
      await axios.delete(`http://localhost:3000/products/${id}`, getAuthHeader());
      fetchProducts();
    } catch (error) {
      alert('ลบสินค้าไม่ได้');
    }
  };

  return (
    <div className="admin-container">
      <h1>👑 Admin Dashboard</h1>
      
      <div className="card form-card">
        <h2>เพิ่มสินค้าใหม่</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input name="name" placeholder="ชื่อสินค้า" value={newProduct.name} onChange={handleInputChange} required />
          <input name="price" type="number" placeholder="ราคา" value={newProduct.price || ''} onChange={handleInputChange} required />
          <input name="stock" type="number" placeholder="สต็อก" value={newProduct.stock || ''} onChange={handleInputChange} required />
          
          <input 
            name="imageUrl" 
            placeholder="URL รูปภาพ (เช่น https://site.com/img.jpg)" 
            value={newProduct.imageUrl} 
            onChange={handleInputChange} 
            className="full-width-input"
          />

          <input name="description" placeholder="รายละเอียด" value={newProduct.description} onChange={handleInputChange} className="full-width-input" />
          
          <button type="submit" className="btn-add">+ เพิ่มสินค้า</button>
        </form>
      </div>

      <div className="card table-card">
        <h2>📦 รายการสินค้า ({products.length})</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>รูปภาพ</th>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>สต็อก</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                    {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="product-thumb"/>
                    ) : (
                        <span style={{color:'#ccc'}}>ไม่มีรูป</span>
                    )}
                </td>
                <td>{p.name}</td>
                <td>{p.price.toLocaleString()}</td>
                <td style={{ color: p.stock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>{p.stock}</td>
                <td><button onClick={() => handleDelete(p.id)} className="btn-delete">ลบ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}