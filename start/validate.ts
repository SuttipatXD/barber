import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  'required': '{{ field }} จำเป็นต้องกรอก', // Default for all required fields
  'string': '{{ field }} ต้องเป็นข้อความ', // Default for all string fields
  'email': '{{ field }} ไม่ใช่รูปแบบอีเมล์', // Default for all email fields
  'minLength': '{{ field }} ต้องมีความยาวอย่างน้อย {{minLength}} ตัวอักษร', // Default for minLength

  // Specific messages for 'fullName'
  'fullName.required': 'กรุณากรอกชื่อ',
  'fullName.string': 'กรุณากรอกชื่อเป็นตัวอักษร',
  'fullName.minLength': 'กรุณากรอกชื่อ',

  // Specific messages for 'email'
  'email.required': 'กรุณากรอกอีเมล์',
  'email.email': 'กรุณากรอกอีเมล์ให้ถูกต้อง ตามรูปแบบ: `yourname@example.com',
  'database.unique': 'มีข้อมูลชื่อผู้ใช้นี้ในระบบแล้ว',

  // Specific messages for 'password'
  'password.required': 'กรุณากรอกรหัสผ่าน',
  'password.minLength': 'กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัวอักษร',
  'password.confirmed': 'รหัสผ่านและการยืนยันไม่ตรงกัน',

  // Specific messages for 'password'
  'password_confirmation.required': 'กรุณากรอกยืนยันรหัสผ่าน',
  'password_confirmation.minLength': 'กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัวอักษร',
})
