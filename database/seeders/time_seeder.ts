import { DateTime } from 'luxon'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Time from '#models/time'

export default class extends BaseSeeder {
  public async run() {
    const openHour = 9
    const closeHour = 21

    const slots = []

    let currentTime = DateTime.fromObject({ hour: openHour, minute: 0 })

    const endTime = DateTime.fromObject({ hour: closeHour, minute: 0 })

    while (currentTime < endTime) {
      const time = currentTime.toFormat('HH:mm')

      slots.push({
        time,
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      })

      currentTime = currentTime.plus({ minutes: 30 }) // เพิ่มทีละ 30 นาที
    }
    await Time.createMany(slots)
  }
}
