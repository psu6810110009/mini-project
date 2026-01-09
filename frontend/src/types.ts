// frontend/src/types.ts

// 1. สินค้า (Product)
export interface Product { 
  id: number;
  name: string;
  description?: string;
  price: number; // ใน DB เป็น Decimal แต่เวลารับมาจะเป็น Number
  stock: number;
  // หมายเหตุ: ใน Schema คุณตั้งชื่อว่า imageUrl แต่ถ้า UI เดิมใช้ image 
  // คุณอาจต้องแก้ UI หรือแก้ตรงนี้ให้ตรงกัน (ผมใส่ให้ทั้งคู่กันเหนียว)
  image?: string; 
  imageUrl?: string; 
}

// 2. ผู้ใช้งาน (User) - อัปเดตตาม Schema ใหม่
export interface User {
  id: number;
  email: string;    // 👈 เปลี่ยนจาก username เป็น email แล้ว
  fullName?: string; // 👈 เพิ่ม field นี้มาใหม่
  role: 'ADMIN' | 'USER';
}

// 3. การตอบกลับ Auth
export interface AuthResponse {
  access_token: string;
  user: User; // ส่งข้อมูล User กลับมาด้วยจะสะดวกตอนแสดงชื่อ
}

// 4. รายการสินค้าในบิล (Order Item) - ของใหม่
export interface OrderItem {
  id: number;
  productId: number;
  product: Product; // เอาไว้โชว์รูปกับชื่อสินค้าในประวัติ
  quantity: number;
  price: number;    // ราคา ณ ตอนที่ซื้อ
}

// 5. บิลใบเสร็จ (Order) - ของใหม่
export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED'; // ตาม Enum ใน Schema
  createdAt: string; // รับวันที่มาเป็น String (ISO format)
  items: OrderItem[];
}