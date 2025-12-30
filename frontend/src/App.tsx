import { Routes, Route } from 'react-router-dom';
import Login from './Login.tsx';
import Products from './Products.tsx';
import Register from './Register.tsx'; // 👈 1. อย่าลืม import

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/register" element={<Register />} /> {/* 👈 2. เพิ่มบรรทัดนี้ */}
    </Routes>
  );
}

export default App;