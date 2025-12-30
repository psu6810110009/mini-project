import { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  // 1. ประกาศตัวแปรเป็น email (ถูกต้องแล้ว)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('กำลัง Login...', email);
      
      const response = await api.post('/auth/login', {
        email,      // ส่ง email ไป
        password,
      });

      localStorage.setItem('token', response.data.access_token);

      alert('Login สำเร็จ! ยินดีต้อนรับครับ 🎉');
      navigate('/products');

    } catch (error) {
      alert('Login ไม่ผ่าน! กรุณาตรวจสอบ Email หรือ Password อีกครั้งครับ ❌');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          <span role="img" aria-label="lock">🔐</span> เข้าสู่ระบบ
        </h2>

        <div className="login-leaf-divider">
           🍃
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {/* 👇 จุดที่แก้: เปลี่ยน Input จาก Username เป็น Email ทั้งก้อน */}
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email" // เปลี่ยน type เป็น email เพื่อให้คีย์บอร์ดมือถือใช้ง่ายขึ้น
              className="input-field"
              value={email} // 👈 ใช้ตัวแปร email
              onChange={(e) => setEmail(e.target.value)} // 👈 ใช้ function setEmail
              placeholder="กรอกอีเมลของคุณ (เช่น test@gmail.com)"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          <button type="submit" className="login-button">
            เข้าสู่ระบบ
          </button>
          
          <p style={{marginTop: '10px', textAlign: 'center'}}>
           ยังไม่มีบัญชี? <span style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => navigate('/register')}>สมัครสมาชิกที่นี่</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;