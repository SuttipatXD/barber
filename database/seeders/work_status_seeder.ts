import WorkStatus from '#models/work_status'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await WorkStatus.createMany([
      { work_status_name: 'รอดำเนินการ' },
      { work_status_name: 'เสร็จสิ้น' },
    ])
  }
}
