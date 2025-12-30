import { useEffect, useState } from 'react';
import api from './api';
import './Products.css';

// Interface
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string; // ใช้ชื่อให้ตรงกับหลังบ้าน (imageUrl หรือ image เช็คดูนะครับ)
}

interface CartItem extends Product {
  quantity: number;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State ตะกร้าสินค้า
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🛒 ฟังก์ชัน: เพิ่มของลงตะกร้า (อัปเกรด: เช็คสต็อกก่อนเพิ่ม)
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;

      // เช็คว่าถ้าเพิ่มอีก 1 จะเกินสต็อกจริงไหม?
      if (currentQty + 1 > product.stock) {
        alert(`มีสินค้าเพียง ${product.stock} ชิ้นในสต็อกครับ`);
        return prevCart;
      }

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        setIsCartOpen(true); // เปิดตะกร้าอัตโนมัติเมื่อใส่ชิ้นแรก
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 🗑️ ฟังก์ชัน: ลบของออกจากตะกร้า
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 📦 ฟังก์ชัน: ยืนยันคำสั่งซื้อ
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!confirm(`ยืนยันการสั่งซื้อรวม ${calculateTotal().toLocaleString()} บาท?`)) return;

    try {
      // Mapping ให้ตรงกับที่ Backend (NestJS) ต้องการ
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }))
      };

      await api.post('/orders', orderData);

      alert('🎉 สั่งซื้อสำเร็จ! ขอบคุณที่อุดหนุนครับ');
      setCart([]); 
      setIsCartOpen(false); 
      fetchProducts(); // โหลดสต็อกล่าสุด
      
    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  if (loading) return <div className="loading-screen">กำลังโหลดหน้าร้าน... 🌱</div>;

  return (
    <div className="products-page">
      {/* Header */}
      <header className="products-header">
        <div className="header-content">
          <h1>🌿 Plant Space</h1>
          <p>พื้นที่สำหรับคนรักสีเขียว</p>
        </div>
        
        <div className="header-actions">
           {/* ปุ่มตะกร้า */}
            <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="cart-toggle-btn"
            >
                🛒 ตะกร้า ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>

           {/* ปุ่ม Logout */}
            <button onClick={() => { localStorage.removeItem('token'); window.location.href='/'; }} className="logout-btn">
                ออกจากระบบ
            </button>
        </div>
      </header>

      {/* 🛒 Popup ตะกร้าสินค้า */}
      {isCartOpen && (
        <div className="cart-modal">
            <div className="cart-content">
                <div className="cart-header">
                    <h2>🛒 ตะกร้าของคุณ</h2>
                    <button onClick={() => setIsCartOpen(false)} className="close-btn">❌</button>
                </div>
                
                {cart.length === 0 ? (
                    <p className="empty-cart">ยังไม่มีสินค้าในตะกร้า</p>
                ) : (
                    <div>
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <div className="cart-item-actions">
                                        <span className="item-price">{(Number(item.price) * item.quantity).toLocaleString()} ฿</span>
                                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">ลบ</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-footer">
                            <h3>ราคารวม: {calculateTotal().toLocaleString()} บาท</h3>
                            <button onClick={handleCheckout} className="checkout-btn">
                                💸 ยืนยันสั่งซื้อ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Grid แสดงสินค้า */}
      <div className="products-container">
        <div className="products-grid">
            {products.map((item) => (
            <div key={item.id} className="product-card">
                <div className="product-image-container">
                    {/* เช็คทั้ง imageUrl และ image เผื่อ Backend ส่งมาไม่เหมือนกัน */}
                    {item.imageUrl || (item as any).image ? (
                        <img src={item.imageUrl || (item as any).image} alt={item.name} className="product-image" />
                    ) : (
                        <div className="no-image-placeholder">🪴</div>
                    )}
                </div>
                
                <div className="product-info">
                    <h3>{item.name}</h3>
                    <p className="description">{item.description || '-'}</p>
                    
                    <div className="product-meta">
                        <span className="price">{Number(item.price).toLocaleString()} ฿</span>
                        <span className={item.stock > 0 ? "stock-ok" : "stock-out"}>
                            {item.stock > 0 ? `เหลือ ${item.stock} ชิ้น` : 'สินค้าหมด'}
                        </span>
                    </div>

                    <button 
                        className="buy-btn"
                        onClick={() => addToCart(item)}
                        disabled={item.stock <= 0}
                    >
                        {item.stock > 0 ? 'ใส่ตะกร้า 🛒' : 'ของหมด'}
                    </button>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Products;