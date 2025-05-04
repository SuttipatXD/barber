import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'แอดมินซอล',
        email: 'admin@example.com',
        password: '123456',
        role: 1,
        status: 1,
      },
      {
        fullName: 'ช่างเอ',
        email: 'employee1@example.com',
        password: '123456',
        role: 2,
        status: 1,
      },
      {
        fullName: 'ลูกค้าสมชาย',
        email: 'customer1@example.com',
        password: '123456',
        role: 3,
        status: 1,
      },
      {
        fullName: 'ช่างบี',
        email: 'employee2@example.com',
        password: '123456',
        role: 2,
        status: 1,
      },
      {
        fullName: 'ลูกค้าอนงค์',
        email: 'customer2@example.com',
        password: '123456',
        role: 3,
        status: 1,
      },
    ])
  }
}
