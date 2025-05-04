import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Status from '#models/status'

export default class extends BaseSeeder {
  async run() {
    await Status.createMany([{ status_name: 'ไม่ว่าง' }, { status_name: 'ว่าง' }])
  }
}
