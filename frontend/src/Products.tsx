import { useEffect, useState } from 'react';
import api from './api';
import type { Product } from './types';
import './Products.css';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 👇 State สำหรับเปิด/ปิดฟอร์มเพิ่มสินค้า
  const [showAddForm, setShowAddForm] = useState(false);
  
  // 👇 State สำหรับเก็บข้อมูลสินค้าใหม่
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันจัดการการพิมพ์ในฟอร์ม
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // ฟังก์ชันกด "บันทึก" เพื่อเพิ่มสินค้าจริง
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันเว็บรีเฟรช
    try {
      // เตรียมข้อมูลส่งไป Backend
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price), // แปลงเป็นตัวเลขทศนิยม
        stock: parseInt(newProduct.stock),   // แปลงเป็นจำนวนเต็ม
      };

      await api.post('/products', payload);
      
      alert('✅ ลงขายต้นไม้เรียบร้อย!');
      setShowAddForm(false); // ปิดฟอร์ม
      setNewProduct({ name: '', description: '', price: '', stock: '', image: '' }); // ล้างค่าในฟอร์ม
      fetchProducts(); // ดึงข้อมูลใหม่มาแสดงทันที
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาด! กรุณาเช็คว่ากรอกข้อมูลครบถ้วนหรือไม่');
    }
  };

  const handleInterest = (name: string) => {
    alert(`ขอบคุณที่สนใจต้น "${name}" เราจะติดต่อกลับหาคุณโดยเร็วครับ 🌿`);
  };

  if (loading) return <div className="loading-screen">กำลังโหลดหน้าร้าน... 🌱</div>;

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="header-content">
          <h1>🌿 Plant Space</h1>
          <p>พื้นที่สำหรับคนรักสีเขียว</p>
        </div>
        
        <div style={{display: 'flex', gap: '10px'}}>
            {/* 👇 ปุ่มเปิดฟอร์มขายของ */}
            <button 
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  backgroundColor: showAddForm ? '#dc3545' : '#28a745', 
                  color: 'white', 
                  border:'none', 
                  padding:'8px 15px', 
                  borderRadius:'5px', 
                  cursor:'pointer',
                  fontWeight: 'bold'
                }}
            >
                {showAddForm ? '❌ ปิดฟอร์ม' : '➕ ลงขายต้นไม้'}
            </button>

            <button 
            onClick={() => { localStorage.removeItem('token'); window.location.href='/'; }} 
            className="logout-btn"
            >
            ออกจากระบบ
            </button>
        </div>
      </header>

      {/* 👇 ส่วนฟอร์มเพิ่มสินค้า (จะแสดงเมื่อกดปุ่ม) */}
      {showAddForm && (
        <div style={{
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          margin: '20px auto', 
          maxWidth: '600px', 
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{marginTop: 0, color: '#2c3e50'}}>📝 ข้อมูลต้นไม้ต้นใหม่</h3>
          <form onSubmit={handleAddProduct} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            
            <input 
              type="text" name="name" placeholder="ชื่อต้นไม้ (เช่น มอนสเตอร่า)" 
              value={newProduct.name} onChange={handleInputChange} required 
              style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            
            <input 
              type="text" name="description" placeholder="คำอธิบายสั้นๆ" 
              value={newProduct.description} onChange={handleInputChange} 
              style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            
            <div style={{display: 'flex', gap: '10px'}}>
              <input 
                type="number" name="price" placeholder="ราคา (บาท)" 
                value={newProduct.price} onChange={handleInputChange} required 
                style={{flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
              />
              <input 
                type="number" name="stock" placeholder="จำนวนสินค้า (ต้น)" 
                value={newProduct.stock} onChange={handleInputChange} required 
                style={{flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
              />
            </div>

            <input 
              type="text" name="image" placeholder="ลิงก์รูปภาพ (URL)" 
              value={newProduct.image} onChange={handleInputChange} 
              style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            <small style={{color: '#666'}}>*แนะนำให้หา link รูปจาก google มาใส่ (คลิกขวาที่รูป - copy image address)</small>

            <button type="submit" style={{
              backgroundColor: '#28a745', color: 'white', padding: '10px', 
              border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginTop: '10px'
            }}>
              ✅ ยืนยันลงขาย
            </button>
          </form>
        </div>
      )}

      {/* ส่วนแสดงรายการสินค้า */}
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="no-image-placeholder">🪴</div>
                )}
              </div>
              <div className="product-info">
                <h3>{item.name}</h3>
                <p className="description">{item.description || 'ต้นไม้คัดเกรด คุณภาพดี'}</p>
                <div className="product-footer">
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <span className="price">{Number(item.price).toLocaleString()} ฿</span>
                    <span style={{fontSize: '12px', color: '#666'}}>เหลือ: {item.stock} ต้น</span>
                  </div>
                  <button 
                    className="buy-btn"
                    onClick={() => handleInterest(item.name)}
                  >
                    จองเลย
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', width: '100%', marginTop: '50px'}}>
            <p className="no-data">ยังไม่มีสินค้าในร้าน</p>
            <p>กดปุ่ม "➕ ลงขายต้นไม้" ด้านบนเพื่อเพิ่มสินค้าได้เลย!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;