import { Routes, Route } from 'react-router-dom';
import Login from './Login.tsx';
import Products from './Products.tsx';
import Register from './Register.tsx';
import AdminDashboard from './AdminDashboard.tsx';
import ProtectedRoute from './ProtectedRoute'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/register" element={<Register />} />
      
      {/* 👇 แก้บรรทัดนี้ครับ: เอา ProtectedRoute มาครอบ AdminDashboard ไว้ */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      /> 
    </Routes>
  );
}

export default App;