import React, { useState, useEffect } from 'react';
import api from './api'; // ✅ เรียกใช้ api ที่เราตั้งค่าไว้
import './AdminDashboard.css';
import Swal from 'sweetalert2'; // ✅ Import Swal มาใช้

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

  // State สำหรับสินค้าที่กำลังแก้ไข
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products'); // ✅ ใช้ api.get สั้นๆ
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // --- Input Change (เพิ่ม) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  // --- Input Change (แก้ไข) ---
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  // ✅ ฟังก์ชันเพิ่มสินค้า (Create) - ใช้ Swal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      
      Swal.fire({
          icon: 'success',
          title: 'เพิ่มสินค้าสำเร็จ!',
          text: `เพิ่ม ${newProduct.name} เรียบร้อยแล้ว`,
          timer: 1500,
          showConfirmButton: false
      });

      setNewProduct({ name: '', price: 0, stock: 0, description: '', imageUrl: '' }); 
      fetchProducts();
    } catch (error) {
      Swal.fire('Error', 'เพิ่มสินค้าไม่สำเร็จ', 'error');
    }
  };

  // ✅ ฟังก์ชันลบสินค้า (Delete) - ใช้ Swal ถามก่อนลบ
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
        title: 'แน่ใจนะว่าจะลบ?',
        text: "ข้อมูลจะหายไปถาวรเลยนะครับ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        try {
            await api.delete(`/products/${id}`);
            Swal.fire('ลบแล้ว!', 'สินค้าถูกลบเรียบร้อย', 'success');
            fetchProducts();
        } catch (error) {
            Swal.fire('Error', 'ลบสินค้าไม่ได้', 'error');
        }
    }
  };

  // เปิด Modal แก้ไข
  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
  };

  // ✅ ฟังก์ชันบันทึกการแก้ไข (Update) - ใช้ Swal
  const handleUpdateSubmit = async () => {
    if (!editingProduct) return;
    try {
      await api.put(`/products/${editingProduct.id}`, editingProduct);
      
      Swal.fire({
          icon: 'success',
          title: 'แก้ไขเรียบร้อย!',
          timer: 1500,
          showConfirmButton: false
      });

      setEditingProduct(null); // ปิด Modal
      fetchProducts();
    } catch (error) {
      Swal.fire('Error', 'แก้ไขข้อมูลไม่สำเร็จ', 'error');
    }
  };

  return (
    <div className="admin-container">
      <h1 style={{textAlign:'center', margin: '20px 0'}}>👑 Admin Dashboard</h1>
      
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
                  <button 
                    onClick={() => handleEditClick(p)} 
                    className="btn-edit"
                    style={{ marginRight: '5px', background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    แก้ไข
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn-delete">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Modal Popup สำหรับแก้ไข */}
      {editingProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>✏️ แก้ไขสินค้า ID: {editingProduct.id}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input name="name" value={editingProduct.name} onChange={handleEditChange} placeholder="ชื่อสินค้า" style={inputStyle} />
              <input name="price" type="number" value={editingProduct.price} onChange={handleEditChange} placeholder="ราคา" style={inputStyle} />
              <input name="stock" type="number" value={editingProduct.stock} onChange={handleEditChange} placeholder="สต็อก" style={inputStyle} />
              <input name="imageUrl" value={editingProduct.imageUrl || ''} onChange={handleEditChange} placeholder="URL รูปภาพ" style={inputStyle} />
              <input name="description" value={editingProduct.description || ''} onChange={handleEditChange} placeholder="รายละเอียด" style={inputStyle} />
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

// Style เล็กน้อยสำหรับ Input ใน Modal
const inputStyle = {
    padding: '8px', 
    border: '1px solid #ddd', 
    borderRadius: '4px'
};