import { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // ยืม CSS จากหน้า Login มาใช้เลย จะได้สวยเหมือนกัน

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '', // เผื่อ backend ต้องการ
    name: ''   // เผื่อ backend ต้องการ
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('กำลังสมัคร...', formData);
      
      // ยิงไปที่ Backend (ต้องมั่นใจว่า Backend มีเส้นทางนี้นะครับ)
      await api.post('/auth/register', formData); 

      alert('🎉 สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/'); // ส่งกลับไปหน้า Login

    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'สมัครไม่ผ่าน กรุณาลองใหม่';
      alert('❌ Error: ' + message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">📝 สมัครสมาชิกใหม่</h2>
        
        <div className="login-leaf-divider">🌱</div>

        <form onSubmit={handleRegister} className="login-form">
          
          <div className="input-group">
            <label className="input-label">Username (ชื่อผู้ใช้)</label>
            <input type="text" name="username" className="input-field" 
              onChange={handleChange} required placeholder="ตั้งชื่อผู้ใช้..." />
          </div>

          <div className="input-group">
            <label className="input-label">Password (รหัสผ่าน)</label>
            <input type="password" name="password" className="input-field" 
              onChange={handleChange} required placeholder="ตั้งรหัสผ่าน..." />
          </div>

          <div className="input-group">
            <label className="input-label">Email (อีเมล)</label>
            <input type="email" name="email" className="input-field" 
              onChange={handleChange} required placeholder="example@mail.com" />
          </div>

          <div className="input-group">
            <label className="input-label">Name (ชื่อเล่น)</label>
            <input type="text" name="name" className="input-field" 
              onChange={handleChange} required placeholder="ชื่อของคุณ" />
          </div>

          <button type="submit" className="login-button" style={{backgroundColor: '#28a745'}}>
            ยืนยันการสมัคร
          </button>

          <p style={{marginTop: '15px', textAlign: 'center'}}>
             มีบัญชีแล้ว? <span style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}} 
             onClick={() => navigate('/')}>กลับไปหน้า Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;