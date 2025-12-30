import axios from 'axios';

// สร้างตัวยิง API ไปที่ Server ของเราบน Render
const api = axios.create({
  baseURL: 'https://mini-project-2g7t.onrender.com', // 👈 URL ที่เรา Deploy เสร็จตะกี้
  headers: {
    'Content-Type': 'application/json',
  },
});

// ฟังก์ชันสำหรับใส่ Token อัตโนมัติ (เดี๋ยวเรามาเติมทีหลังตอนทำ Login เสร็จ)
export default api;