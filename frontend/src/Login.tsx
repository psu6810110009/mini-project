import { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ 1. เพิ่มบรรทัดนี้
import './Login.css';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('กำลัง Login...', email);
      
      const response = await api.post('/auth/login', {
        email,      
        password,
      });

      localStorage.setItem('token', response.data.access_token);

      // ✅ 2. แก้ตรงนี้: ใช้ Swal แทน alert (Login สำเร็จ)
      Swal.fire({
        title: 'Login สำเร็จ!',
        text: 'ยินดีต้อนรับสู่ Plant Space ครับ 🎉',
        icon: 'success',
        confirmButtonText: 'ไปช้อปปิ้งกันเลย! 🛒',
        confirmButtonColor: '#10B981' // สีเขียวเข้าธีม
      }).then(() => {
        // พอกดปุ่ม หรือปิด Popup ให้ไปหน้า Products
        navigate('/products');
      });

    } catch (error) {
      console.error(error);
      
      // ✅ 3. แก้ตรงนี้: ใช้ Swal แทน alert (Login พลาด)
      Swal.fire({
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: 'กรุณาตรวจสอบ Email หรือ Password อีกครั้งครับ ❌',
        icon: 'error',
        confirmButtonText: 'ลองใหม่',
        confirmButtonColor: '#d33' // สีแดง
      });
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
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email" 
              className="input-field"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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