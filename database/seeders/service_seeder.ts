import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Service from '#models/service' // Make sure this path is correct for your Service model

export default class extends BaseSeeder {
  async run() {
    await Service.createMany([
      {
        service_name: 'ตัดผม',
        service_status: 1,
      },
      {
        service_name: 'โกนหนวด',
        service_status: 1,
      },
      {
        service_name: 'สระผม & ไดร์',
        service_status: 1,
      },
      {
        service_name: 'ทำสีผม',
        service_status: 1,
      },
      {
        service_name: 'ดัดผม',
        service_status: 0,
      },
      {
        service_name: 'นวดหน้า',
        service_status: 1,
      },
    ])
  }
}
