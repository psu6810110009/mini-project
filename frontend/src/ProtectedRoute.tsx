import React from 'react'; // 👈 1. เพิ่มบรรทัดนี้ เพื่อดึง Type เข้ามา
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode; // 👈 2. เปลี่ยนจาก JSX.Element เป็น React.ReactNode (ครอบคลุมกว่า)
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');

  // ถ้าไม่มี Token -> ดีดไปหน้า Login ทันที
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ามี Token -> ปล่อยผ่าน
  return <>{children}</>; // 👈 3. ใส่ fragment <></> ครอบไว้นิดนึงกันเหนียว
};

export default ProtectedRoute;