import { Routes, Route } from 'react-router-dom';
import Login from './Login.tsx';
import Products from './Products.tsx';
import Register from './Register.tsx';
import AdminDashboard from './AdminDashboard.tsx'; // 👈 1. เพิ่มบรรทัดนี้ (อย่าลืมสร้างไฟล์ AdminDashboard.tsx ก่อนนะ)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/register" element={<Register />} />
      
      {/* 👇 2. เพิ่ม Route นี้เข้าไปครับ */}
      <Route path="/admin" element={<AdminDashboard />} /> 
    </Routes>
  );
}

export default App;