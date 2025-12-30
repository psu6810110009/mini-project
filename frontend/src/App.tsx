import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Products from './Products'; // Import เข้ามาใหม่

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* เปลี่ยนจากหน้า Coming Soon เป็นหน้า Products จริงๆ */}
        <Route path="/products" element={<Products />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;