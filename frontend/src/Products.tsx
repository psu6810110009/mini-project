import { useEffect, useState } from 'react';
import api from './api';
import type { Product } from './types';
import './Products.css';

// กำหนดหน้าตาของของในตะกร้า (เพิ่ม quantity เข้ามา)
interface CartItem extends Product {
  quantity: number;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 👇 State สำหรับตะกร้าสินค้า
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // เปิด/ปิดดูตะกร้า

  // State สำหรับฟอร์มลงขายของ (อันเดิม)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', stock: '', image: ''
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

  // 🛒 ฟังก์ชัน: เพิ่มของลงตะกร้า
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
        alert('ขออภัย สินค้าหมดแล้ว!');
        return;
    }

    setCart((prevCart) => {
      // เช็คว่ามีสินค้านี้ในตะกร้าหรือยัง?
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // ถ้ามีแล้ว ให้เพิ่มจำนวน (Quantity + 1)
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // ถ้ายังไม่มี ให้ใส่เข้าไปใหม่ พร้อมระบุจำนวนเป็น 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // แจ้งเตือนเล็กน้อย หรือเปิดตะกร้าให้ดูเลยก็ได้
    // alert(`ใส่ "${product.name}" ลงตะกร้าแล้ว`);
    setIsCartOpen(true); // เด้งตะกร้าขึ้นมาให้ดู
  };

  // 🗑️ ฟังก์ชัน: ลบของออกจากตะกร้า
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 📦 ฟังก์ชัน: ยืนยันคำสั่งซื้อ (ส่งไป Backend)
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!confirm(`ยืนยันการสั่งซื้อรวม ${calculateTotal().toLocaleString()} บาท?`)) return;

    try {
      // เตรียมข้อมูลตามที่ Backend (น่าจะ) ต้องการ
      // โดยปกติ Backend จะต้องการแค่ { productId, quantity }
      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // ยิง API สร้าง Order (⚠️ Backend ต้องรองรับ structure นี้นะครับ เดี๋ยวเราไปเช็คกัน)
      await api.post('/orders', { items: orderItems });

      alert('🎉 สั่งซื้อสำเร็จ! ขอบคุณที่อุดหนุนครับ');
      setCart([]); // ล้างตะกร้า
      setIsCartOpen(false); // ปิดตะกร้า
      fetchProducts(); // โหลดสต็อกสินค้าใหม่ (เพราะสต็อกต้องลดลง)
      
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการสั่งซื้อ (Backend อาจจะยังไม่พร้อมรับข้อมูล)');
    }
  };

  // คำนวณราคารวม
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  // --- ส่วนจัดการฟอร์มลงขายของ (เหมือนเดิม) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      };
      await api.post('/products', payload);
      alert('✅ ลงขายต้นไม้เรียบร้อย!');
      setShowAddForm(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', image: '' });
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาด! กรุณาเช็คข้อมูล');
    }
  };

  if (loading) return <div className="loading-screen">กำลังโหลดหน้าร้าน... 🌱</div>;

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="header-content">
          <h1>🌿 Plant Space</h1>
          <p>พื้นที่สำหรับคนรักสีเขียว</p>
        </div>
        
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            {/* ปุ่มดูตะกร้าสินค้า */}
            <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="cart-toggle-btn"
                style={{position: 'relative', backgroundColor: '#e67e22', color:'white', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer'}}
            >
                🛒 ตะกร้า ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>

            <button 
                onClick={() => setShowAddForm(!showAddForm)}
                style={{backgroundColor: showAddForm ? '#dc3545' : '#28a745', color: 'white', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer'}}
            >
                {showAddForm ? '❌ ปิด' : '➕ ลงขาย'}
            </button>

            <button onClick={() => { localStorage.removeItem('token'); window.location.href='/'; }} className="logout-btn">
                ออก
            </button>
        </div>
      </header>

      {/* 🛒 ส่วนแสดงตะกร้าสินค้า (Popup หรือ Panel) */}
      {isCartOpen && (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, 
            backgroundColor: 'white', borderTop: '4px solid #e67e22', 
            padding: '20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.2)', zIndex: 1000
        }}>
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>🛒 ตะกร้าของคุณ</h2>
                    <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>❌</button>
                </div>
                
                {cart.length === 0 ? (
                    <p style={{color: '#888'}}>ยังไม่มีสินค้าในตะกร้า เลือกช้อปด้านบนได้เลย!</p>
                ) : (
                    <div>
                        {cart.map((item) => (
                            <div key={item.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #eee'}}>
                                <span>{item.name} (x{item.quantity})</span>
                                <div>
                                    <span style={{fontWeight:'bold', marginRight:'10px'}}>{(Number(item.price) * item.quantity).toLocaleString()} ฿</span>
                                    <button onClick={() => removeFromCart(item.id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>ลบ</button>
                                </div>
                            </div>
                        ))}
                        <div style={{marginTop: '20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <h3>ราคารวมทั้งสิ้น: {calculateTotal().toLocaleString()} บาท</h3>
                            <button onClick={handleCheckout} style={{backgroundColor: '#e67e22', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', fontSize:'16px', cursor:'pointer'}}>
                                💸 ยืนยันสั่งซื้อ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* ฟอร์มลงขายสินค้า */}
      {showAddForm && (
        <div style={{backgroundColor: '#f8f9fa', padding: '20px', margin: '20px auto', maxWidth: '600px', borderRadius: '10px'}}>
          <h3>📝 ลงขายสินค้าใหม่</h3>
          <form onSubmit={handleAddProduct} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <input type="text" name="name" placeholder="ชื่อสินค้า" value={newProduct.name} onChange={handleInputChange} required style={{padding: '8px'}}/>
            <input type="text" name="description" placeholder="รายละเอียด" value={newProduct.description} onChange={handleInputChange} style={{padding: '8px'}}/>
            <div style={{display: 'flex', gap: '10px'}}>
              <input type="number" name="price" placeholder="ราคา" value={newProduct.price} onChange={handleInputChange} required style={{flex: 1, padding: '8px'}}/>
              <input type="number" name="stock" placeholder="จำนวน" value={newProduct.stock} onChange={handleInputChange} required style={{flex: 1, padding: '8px'}}/>
            </div>
            <input type="text" name="image" placeholder="URL รูปภาพ" value={newProduct.image} onChange={handleInputChange} style={{padding: '8px'}}/>
            <button type="submit" style={{backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>บันทึก</button>
          </form>
        </div>
      )}

      {/* รายการสินค้า */}
      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-image">
              {item.image ? <img src={item.image} alt={item.name} /> : <div className="no-image-placeholder">🪴</div>}
            </div>
            <div className="product-info">
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>
              <div className="product-footer">
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className="price">{Number(item.price).toLocaleString()} ฿</span>
                  <span style={{fontSize: '12px', color: item.stock > 0 ? '#666' : 'red'}}>
                    {item.stock > 0 ? `เหลือ: ${item.stock}` : 'สินค้าหมด'}
                  </span>
                </div>
                <button 
                  className="buy-btn"
                  onClick={() => addToCart(item)}
                  disabled={item.stock <= 0}
                  style={{
                      backgroundColor: item.stock > 0 ? '#2c3e50' : '#ccc',
                      cursor: item.stock > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  {item.stock > 0 ? 'ใส่ตะกร้า 🛒' : 'หมดแล้ว'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;