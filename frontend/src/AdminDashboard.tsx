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
  
  // State สำหรับฟอร์มเพิ่มสินค้าใหม่
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    imageUrl: ''
  });

  // ✨ State สำหรับสินค้าที่กำลังแก้ไข (เพิ่มใหม่)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    } catch (error: any) {
      console.error("Error fetching products:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
         alert("Session หมดอายุ กรุณา Login ใหม่");
      }
    }
  };

  // --- ส่วนจัดการ Input เพิ่มสินค้า ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  // --- ส่วนจัดการ Input แก้ไขสินค้า (เพิ่มใหม่) ---
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  // ✅ ฟังก์ชันเพิ่มสินค้า (Create)
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
        alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      }
    }
  };

  // ✅ ฟังก์ชันลบสินค้า (Delete)
  const handleDelete = async (id: number) => {
    if (!window.confirm('ยืนยันที่จะลบสินค้านี้?')) return;
    try {
      await axios.delete(`http://localhost:3000/products/${id}`, getAuthHeader());
      fetchProducts();
    } catch (error) {
      alert('ลบสินค้าไม่ได้');
    }
  };

  // ✨ ฟังก์ชันเริ่มแก้ไข (เปิด Modal)
  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product }); // Copy ข้อมูลมาใส่ State
  };

  // ✨ ฟังก์ชันบันทึกการแก้ไข (Update - PUT)
  const handleUpdateSubmit = async () => {
    if (!editingProduct) return;
    try {
      // ยิง API PUT ไปที่ /products/:id
      await axios.put(
        `http://localhost:3000/products/${editingProduct.id}`, 
        editingProduct, 
        getAuthHeader()
      );
      
      alert('แก้ไขข้อมูลเรียบร้อย! ✨');
      setEditingProduct(null); // ปิด Modal
      fetchProducts(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error(error);
      alert('แก้ไขไม่สำเร็จ เช็ค Backend ว่ารองรับ PUT ไหม');
    }
  };

  return (
    <div className="admin-container">
      <h1>👑 Admin Dashboard</h1>
      
      {/* 1. การ์ดเพิ่มสินค้า */}
      <div className="card form-card">
        <h2>เพิ่มสินค้าใหม่</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input name="name" placeholder="ชื่อสินค้า" value={newProduct.name} onChange={handleInputChange} required />
          <input name="price" type="number" placeholder="ราคา" value={newProduct.price || ''} onChange={handleInputChange} required />
          <input name="stock" type="number" placeholder="สต็อก" value={newProduct.stock || ''} onChange={handleInputChange} required />
          <input name="imageUrl" placeholder="URL รูปภาพ" value={newProduct.imageUrl} onChange={handleInputChange} className="full-width-input" />
          <input name="description" placeholder="รายละเอียด" value={newProduct.description} onChange={handleInputChange} className="full-width-input" />
          <button type="submit" className="btn-add">+ เพิ่มสินค้า</button>
        </form>
      </div>

      {/* 2. ตารางสินค้า */}
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
                <td>
                  {/* ปุ่มแก้ไข (เพิ่มใหม่) */}
                  <button 
                    onClick={() => handleEditClick(p)} 
                    className="btn-edit"
                    style={{ marginRight: '5px', background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    แก้ไข
                  </button>
                  {/* ปุ่มลบ */}
                  <button onClick={() => handleDelete(p.id)} className="btn-delete">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Modal Popup สำหรับแก้ไข (เพิ่มใหม่) */}
      {editingProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>✏️ แก้ไขสินค้า ID: {editingProduct.id}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                name="name" 
                value={editingProduct.name} 
                onChange={handleEditChange} 
                placeholder="ชื่อสินค้า"
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input 
                name="price" 
                type="number"
                value={editingProduct.price} 
                onChange={handleEditChange}
                placeholder="ราคา"
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input 
                name="stock" 
                type="number"
                value={editingProduct.stock} 
                onChange={handleEditChange} 
                placeholder="สต็อก"
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
               <input 
                name="imageUrl" 
                value={editingProduct.imageUrl || ''} 
                onChange={handleEditChange} 
                placeholder="URL รูปภาพ"
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => setEditingProduct(null)}
                style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleUpdateSubmit}
                style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}