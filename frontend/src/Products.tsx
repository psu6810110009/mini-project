import { useEffect, useState } from 'react';
import api from './api';
import type { Product } from './types'; // 👈 แก้จาก '.types' เป็น './types'
import './Products.css';

function Products() {
  // กำหนด Type เป็น Array ของ Product
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // ดึงข้อมูลสินค้าจาก Backend
      const response = await api.get('/products');
      // ใช้ Type Assertion เพื่อความปลอดภัยตามหลัก Strict Typing
      setProducts(response.data as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันกด "จอง" (User Interaction) ตามโจทย์ User View
  const handleInterest = (name: string) => {
    alert(`ขอบคุณที่สนใจต้น "${name}" เราจะติดต่อกลับหาคุณโดยเร็วครับ 🌿`);
  };

  if (loading) return <div className="loading-screen">กำลังหาต้นไม้สวยๆ ให้คุณ... 🌱</div>;

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="header-content">
          <h1>🌿 Plant Space</h1>
          <p>พื้นที่สำหรับคนรักสีเขียว</p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} 
          className="logout-btn"
        >
          ออกจากระบบ
        </button>
      </header>

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
                {/* แสดงคำอธิบายสินค้า */}
                <p className="description">{item.description || 'ต้นไม้คัดเกรด คุณภาพดี'}</p>
                <div className="product-footer">
                  <span className="price">{item.price.toLocaleString()} ฿</span>
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
          <p className="no-data">ขออภัย ยังไม่มีรายการต้นไม้ในขณะนี้</p>
        )}
      </div>
    </div>
  );
}

export default Products;