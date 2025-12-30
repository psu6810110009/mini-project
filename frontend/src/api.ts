// frontend/src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ตรวจสอบว่า Backend รันที่ port นี้
});

// 👇 ส่วนที่เพิ่ม: ตัวดักจับ (Interceptor) เพื่อใส่ Token ทุกครั้ง
api.interceptors.request.use(
  (config) => {
    // ดึง Token ที่เราเก็บไว้ตอน Login
    const token = localStorage.getItem('token');
    
    // ถ้ามี Token ให้ใส่เข้าไปใน Header ชื่อ Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;