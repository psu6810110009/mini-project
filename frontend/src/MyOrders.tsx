import { useEffect, useState } from 'react';
import api from './api';
import './Products.css'; // ใช้ CSS ร่วมกัน

// Type สำหรับ Order (แยกออกมาหรือประกาศในนี้ก็ได้)
interface OrderItem {
  id: number;
  price: number;
  quantity: number;
  product: {
    name: string;
    image?: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเลือกสีป้ายสถานะ
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return '#10B981';      // เขียว
      case 'PENDING': return '#F59E0B';   // ส้ม
      case 'SHIPPED': return '#3B82F6';   // ฟ้า
      case 'CANCELLED': return '#EF4444'; // แดง
      default: return '#6B7280';
    }
  };

  if (loading) return <div className="loading-screen">กำลังโหลดประวัติ... 🍃</div>;

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="header-content">
          <h1>📜 ประวัติการสั่งซื้อ</h1>
          <p>รายการต้นไม้ที่คุณรับไปดูแล</p>
        </div>
        <button onClick={() => window.location.href = '/products'} className="logout-btn" style={{backgroundColor: '#666'}}>
          ⬅ กลับไปเลือกซื้อ
        </button>
      </header>

      <div className="products-container" style={{ maxWidth: '800px' }}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="product-card" style={{ marginBottom: '20px', padding: '20px', flexDirection: 'column', cursor: 'default' }}>
              
              {/* หัวบิล */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#333' }}>Order #{order.id}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>
                    {new Date(order.createdAt).toLocaleString('th-TH')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                      display: 'inline-block',
                      padding: '4px 12px', 
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(order.status) + '20',
                      color: getStatusColor(order.status), 
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                    {order.status}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2E7D32', marginTop: '5px' }}>
                    {Number(order.totalPrice).toLocaleString()} ฿
                  </div>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    {/* รูปภาพ */}
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', marginRight: '15px', backgroundColor: '#f0fdf4', border: '1px solid #eee' }}>
                       {item.product.image || item.product.imageUrl ? (
                         <img src={item.product.image || item.product.imageUrl} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       ) : (
                         <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🪴</div>
                       )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#444' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>จำนวน {item.quantity} ต้น</div>
                    </div>
                    
                    <div style={{ fontWeight: '600', color: '#555' }}>
                        {Number(item.price).toLocaleString()} ฿
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '15px' }}>
            <h2>ยังไม่มีประวัติการซื้อ 🛒</h2>
            <button onClick={() => window.location.href = '/products'} className="buy-btn" style={{ marginTop: '20px', maxWidth: '200px' }}>
              ไปเลือกซื้อสินค้า
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;