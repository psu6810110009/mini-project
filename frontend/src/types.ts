// frontend/src/types.ts

// ต้องสะกดว่า Product (P ใหญ่ และไม่มี s) เท่านั้น
export interface Product { 
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
}

// ส่วนอื่นๆ ของคุณคงไว้เหมือนเดิม
export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
}