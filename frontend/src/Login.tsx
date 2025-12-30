import { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  // 👇 จุดที่แก้: เปิดใช้งานโค้ดจริง ลบ // ออกแล้ว
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('กำลัง Login...', username);
      
      // เรียกใช้ api ของจริง (เส้นเหลืองจะหายไปตรงนี้)
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      // เก็บ Token
      localStorage.setItem('token', response.data.access_token);

      alert('Login สำเร็จ! ยินดีต้อนรับครับ 🎉');
      navigate('/products');

    } catch (error) {
      alert('Login ไม่ผ่าน! กรุณาตรวจสอบ Username หรือ Password อีกครั้งครับ ❌');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          <span role="img" aria-label="lock">🔐</span> เข้าสู่ระบบ
        </h2>

        {/* ส่วนใบไม้ที่เพิ่มความสวยงาม */}
        <div className="login-leaf-divider">
           🍃
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
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
        </form>
      </div>
    </div>
  );
}

export default Login;