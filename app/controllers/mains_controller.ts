/* eslint-disable @typescript-eslint/naming-convention */
import Log from '#models/log'
import Time from '#models/time'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class MainsController {
  async home({ view }: HttpContext) {
    const employees = await User.query()
      .where('role', 2)
      .leftJoin('statuses', 'users.status', 'statuses.id')
      .select('users.*', 'statuses.status_name as employee_status_name')

    return view.render('home', { employees })
  }

  async status({ response }: HttpContext) {
    const employees = await User.query()
      .where('role', 2)
      .leftJoin('statuses', 'users.status', 'statuses.id')
      .select('users.*', 'statuses.status_name as employee_status_name')

    return response.ok(employees)
  }

  async reserveTime({ request, response, view }: HttpContext) {
    const payload = request.all()

    const { gender, noBarberCheck, barber_id } = payload

    let finalSelectedBarber = null
    let timeOffsetHours = 0
    let slotDurationMinutes = 0

    if (gender === 'male') {
      timeOffsetHours = 1
      console.log(`เพศชาย: บวกเวลาเพิ่ม ${timeOffsetHours} ชั่วโมง`)
    } else if (gender === 'female') {
      timeOffsetHours = 2
      console.log(`เพศหญิง: บวกเวลาเพิ่ม ${timeOffsetHours} ชั่วโมง`)
    } else {
      console.warn('ไม่พบข้อมูลเพศที่ถูกต้อง, กำหนด Offset เป็น 0')
      timeOffsetHours = 0
    }

    if (barber_id) {
      const barberId = Number(barber_id)
      finalSelectedBarber = await User.find(barberId)
      // ตรวจสอบว่า finalSelectedBarber ถูกพบหรือไม่
      if (!finalSelectedBarber) {
        return response.status(404).json({
          message: 'ไม่พบข้อมูลช่างที่เลือก',
        })
      }
    } else if (noBarberCheck === true) {
      // เมื่อเลือก "ไม่ระบุช่าง" แต่ต้องการข้อมูลช่างคนแรกที่ว่าง
      // หรือสุ่มช่าง, หรือส่งเป็น array ของช่าง
      // ตัวอย่างนี้จะดึงช่างคนแรกที่ตรงเงื่อนไข
      const potentialBarbers = await User.query().where('status', 2).where('role', 2).limit(1)
      finalSelectedBarber = potentialBarbers[0] || null // ได้ช่างคนแรก หรือ null ถ้าไม่เจอ
      if (!finalSelectedBarber) {
        return response.status(404).json({
          message: 'ไม่พบช่างที่พร้อมให้บริการ',
        })
      }
    } else {
      return view.render('reservefail', {
        header: 'การจองไม่สำเร็จ',
        message: 'กรุณาระบุช่างหรือเลือก "ไม่ระบุช่าง" ',
      })
    }

    const allTimes = await Time.query().orderBy('time', 'asc')
    const today = DateTime.local().toISODate()
    console.log(`เวลา ${today} และ ${finalSelectedBarber.id}`)

    // 1. ดึง ID ของเวลาที่ถูกจองจาก Log table
    let bookedTimeIdsOnly: number[] = []
    if (finalSelectedBarber) {
      const rawBookedLogs = await Log.query()
        .where('employee', finalSelectedBarber.id)
        .where('work_status', 1)
        .whereRaw('DATE(created_at) = ?', [today])
        .select('time') // <--- เลือกแค่ time_id

      bookedTimeIdsOnly = rawBookedLogs.map((log) => log.time)
      console.log(
        `ID ของเวลาที่ถูกจองแล้วสำหรับช่าง ${finalSelectedBarber.id} ในวันนี้:`,
        bookedTimeIdsOnly
      )
    } else {
      console.log('ไม่ได้เลือกช่างเฉพาะ, จะไม่กรองเวลาตาม Log ของช่างคนเดียว')
    }

    // 2. ดึงข้อมูล time string จาก Time table โดยใช้ ID ที่ได้มา
    let bookedTimeObjects: { time_id: number; time: string }[] = []
    if (bookedTimeIdsOnly.length > 0) {
      const bookedTimesFromTimeTable = await Time.query()
        .whereIn('id', bookedTimeIdsOnly) // <--- ใช้ whereIn เพื่อหาหลาย ID พร้อมกัน
        .select('id', 'time') // <--- เลือกทั้ง ID และ time string

      // แปลงให้เป็นรูปแบบเดียวกับที่โค้ดต้องการ
      bookedTimeObjects = bookedTimesFromTimeTable.map((t) => ({
        time_id: t.id, // ใช้ 'id' จาก Time table เป็น time_id
        time: t.time, // ดึง 'time' string ออกมา
      }))
    }

    // สร้าง Map ของเวลาทั้งหมดเพื่อใช้ค้นหาเวลาจาก ID ได้ง่ายขึ้น
    const allTimesMap = new Map(allTimes.map((t) => [t.id, t.time]))

    // คำนวณ "ช่วงเวลาที่ช่างติด" (busy ranges)
    const busyRanges: { start: Date; end: Date }[] = []
    const bookedTimeIds: number[] = [] // ยังคงใช้สำหรับกรอง Slot หลัก

    bookedTimeObjects.forEach((log) => {
      const bookedTimeId = log.time_id
      const bookedTimeString = allTimesMap.get(bookedTimeId)

      if (bookedTimeString) {
        bookedTimeIds.push(bookedTimeId) // เก็บ ID ของ Slot ที่ถูกจอง

        const [bookedHours, bookedMinutes] = bookedTimeString.split(':').map(Number)

        const slotStartTime = new Date() // เวลาเริ่มต้นของ Slot ที่จอง
        slotStartTime.setHours(bookedHours, bookedMinutes, 0, 0)
        slotStartTime.setFullYear(2000, 0, 1)

        const slotEndTime = new Date(slotStartTime.getTime()) // คัดลอกเวลาเริ่มต้น
        slotEndTime.setHours(
          slotStartTime.getHours() + timeOffsetHours,
          slotStartTime.getMinutes() + slotDurationMinutes,
          0,
          0
        ) // บวก duration ของบริการ
        slotEndTime.setFullYear(2000, 0, 1)

        busyRanges.push({ start: slotStartTime, end: slotEndTime })
      } else {
        console.warn(`Warning: Time string not found for booked ID: ${bookedTimeId}`)
      }
    })

    console.log(
      'ช่วงเวลาที่ช่างไม่ว่าง:',
      busyRanges.map(
        (r) => `${r.start.toTimeString().substring(0, 5)} - ${r.end.toTimeString().substring(0, 5)}`
      )
    )

    // กรองเวลาที่ว่างและปรับ Offset
    const availableTimes = allTimes
      .filter((timeRecord) => {
        // แปลงเวลาของ timeRecord ปัจจุบันให้เป็น Date object
        const [currentHours, currentMinutes] = timeRecord.time.split(':').map(Number)
        const currentTimeSlotStart = new Date()
        currentTimeSlotStart.setHours(currentHours, currentMinutes, 0, 0)
        currentTimeSlotStart.setFullYear(2000, 0, 1)

        const currentTimeSlotEnd = new Date(currentTimeSlotStart.getTime())
        // ต้องบวก duration ของ Slot ปัจจุบัน เพื่อตรวจสอบการซ้อนทับ
        currentTimeSlotEnd.setHours(
          currentTimeSlotStart.getHours() + timeOffsetHours,
          currentTimeSlotStart.getMinutes() + slotDurationMinutes,
          0,
          0
        )
        currentTimeSlotEnd.setFullYear(2000, 0, 1)

        // ตรวจสอบการซ้อนทับกับ busyRanges
        for (const busyRange of busyRanges) {
          // Logic การตรวจสอบการซ้อนทับของช่วงเวลา
          // ถ้า (เริ่มต้นของ slot ปัจจุบัน < สิ้นสุดของคิวที่จอง) AND (สิ้นสุดของ slot ปัจจุบัน > เริ่มต้นของคิวที่จอง)
          if (currentTimeSlotStart < busyRange.end && currentTimeSlotEnd > busyRange.start) {
            return false // Slot ปัจจุบันซ้อนทับกับช่วงที่ช่างไม่ว่าง
          }
        }

        // ถ้าผ่านการตรวจสอบการซ้อนทับ
        return true
      })
      .map((timeRecord) => {
        // ส่วน map ยังคงเหมือนเดิม
        const [hours, minutes] = timeRecord.time.split(':').map(Number)
        const date = new Date()
        date.setHours(hours, minutes, 0, 0)
        date.setFullYear(2000, 0, 1)

        const displayHours = String(date.getHours()).padStart(2, '0')
        const displayMinutes = String(date.getMinutes()).padStart(2, '0')
        const displayTime = `${displayHours}:${displayMinutes}`

        return {
          id: timeRecord.id,
          time: displayTime,
        }
      })
    console.log('Final availableTimes to be sent:', availableTimes) // ตรวจสอบค่าสุดท้าย

    return response.status(200).json({
      message: 'ได้รับข้อมูลเรียบร้อยแล้ว!',
      timestamp: new Date().toISOString(),
      availableTimes: availableTimes, // ลบ await ออก
      selectedBarber: finalSelectedBarber ? finalSelectedBarber.serialize() : null,
    })
  }

  async updateTask({ view, params }: HttpContext) {
    const idTask = params.id
    const task = await Log.find(idTask)

    if (!task) {
      console.log('ไม่พบงาน')
      return view.render('reservefail', {
        header: 'เกิดข้อผิดพลาด',
        message: 'ไม่พบงาน โปรดลองใหม่อีกครั้ง',
      })
    }

    task.work_status = 2
    await task.save()

    return view.render('reservesuccess', {
      header: 'อัพเดทงานสำเร็จ',
      message: 'อัพเดทงานของคุณเสร็จสมบูรณ์แล้ว',
    })
  }

  async deleteTask({ view, params }: HttpContext) {
    const idTask = params.id
    const task = await Log.find(idTask)

    if (!task) {
      console.log('ไม่พบงาน')
      return view.render('reservefail', {
        header: 'เกิดข้อผิดพลาด',
        message: 'ไม่พบงาน โปรดลองใหม่อีกครั้ง',
      })
    }

    await task.delete()

    return view.render('reservesuccess', {
      header: 'ลบข้อมูลสำเร็จ',
      message: 'ลบข้อมูลการใช้บริการเสร็จสมบูรณ์แล้ว',
    })
  }

  async history({ view, auth }: HttpContext) {
    // ใน controller
    const roleId = auth.user!.role
    const userId = auth.user!.id

    let query = Log.query()
      .join('users as customer', 'logs.customer', 'customer.id')
      .join('users as employee', 'logs.employee', 'employee.id')
      .join('times', 'logs.time', 'times.id')
      .select(
        'logs.*',
        'customer.full_name as customer_full_name',
        'employee.full_name as employee_full_name',
        'logs.id as log_id',
        'times.time'
      )

    if (roleId === 2) {
      query = query.where('logs.employee', userId)
    } else if (roleId === 3) {
      query = query.where('logs.customer', userId)
    }

    const logs = await query

    return view.render('history', { logs })
  }

  async reserve({ view }: HttpContext) {
    const dataBarber = await User.query().where('status', 2).where('role', 2)

    if (!dataBarber[0]) {
      return view.render('reservefail', {
        header: 'การจองไม่สำเร็จ',
        message: 'ไม่พบช่างในระบบ โปรดลองใหม่อีกครั้ง',
      })
    }

    const barber = dataBarber.map((b) => b.toJSON())
    return view.render('reserve', { barber })
  }

  async reserving({ view, auth, request }: HttpContext) {
    const customerId = auth.user!.id
    const { time } = request.only(['time'])
    const selectedBarberId = request.input('barber_id') ?? 0

    let employeeId

    if (selectedBarberId && Number(selectedBarberId) !== 0) {
      employeeId = selectedBarberId
      console.log('เลือกช่างจาก Form:', employeeId)
    }

    const available = await User.query().where('status', 2).where('role', 2)
    let barber

    if (employeeId) {
      barber = await User.find(employeeId)
      if (!barber) {
        console.log('ไม่พบช่าง ID:', employeeId)
        return view.render('reservefail', {
          header: 'การจองไม่สำเร็จ',
          message: 'ไม่พบข้อมูลช่างที่เลือก โปรดลองใหม่อีกครั้ง',
        })
      }
    } else if (available.length === 1) {
      barber = available[0]
      employeeId = barber.id
      console.log('เลือกช่างอัตโนมัติ (มี 1 คน):', employeeId)
    } else if (available.length > 1 && Number(selectedBarberId) === 0) {
      const randomIndex = Math.floor(Math.random() * available.length)
      barber = available[randomIndex]
      employeeId = barber.id
      console.log('สุ่มเลือกช่าง:', employeeId)
    } else {
      console.log('ไม่มีช่างที่พร้อมให้บริการ')
      return view.render('reservefail', {
        header: 'การจองไม่สำเร็จ',
        message: 'ไม่มีช่างที่พร้อมให้บริการในขณะนี้ โปรดลองใหม่อีกครั้ง',
      })
    }

    if (employeeId) {
      const isDuplicateTime = await Log.query()
        .where('employee', employeeId)
        .where('time', request.input('time'))
        .whereRaw('DATE(created_at) = CURRENT_DATE')
        .first()

      if (isDuplicateTime) {
        return view.render('reservefail', {
          header: 'การจองไม่สำเร็จ',
          message: 'เวลานี้ถูกจองแล้วสำหรับช่างคนนี้ กรุณาเลือกเวลาอื่น',
        })
      }

      const reserve = new Log()
      reserve.employee = employeeId
      reserve.customer = customerId
      reserve.time = time
      reserve.work_status = 1
      await reserve.save()
      console.log('บันทึกแล้ว')

      return view.render('reservesuccess', {
        header: 'การจองสำเร็จ',
        message: 'การจองของคุณเสร็จสมบูรณ์แล้ว',
      })
    }
  }

  async updateStatus({ view, auth, request, response }: HttpContext) {
    const payload = request.all()
    const userId = auth.user!.id

    // 3. ค้นหา User ที่ต้องการอัปเดต
    const user = await User.find(userId)

    // ตรวจสอบว่าพบ User หรือไม่
    if (!user) {
      return view.render('reservefail', {
        header: 'ไม่สามารถทำรายการได้',
        message: 'เนื่องจากไม่พบผู้ใช้นี้ในระบบ',
      })
    }

    user.status = payload.statusId // หรือ user.idStatus = newStatusId หากคอลัมน์ชื่อนี้

    await user.save()

    return response.status(200).json({
      message: 'ได้รับข้อมูลเรียบร้อยแล้ว!',
      timestamp: new Date().toISOString(),
    })
  }
}
