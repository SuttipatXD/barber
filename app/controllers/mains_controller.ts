import Log from '#models/log'
import Time from '#models/time'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class MainsController {
  async home({ view }: HttpContext) {
    const employees = await User.query()
      // .where('users.status', 2)
      .where('role', 2)
      .leftJoin('statuses', 'users.status', 'statuses.id')
      .select('users.*', 'statuses.status_name as employee_status_name')

    // console.log(employees)
    return view.render('home', { employees })
  }

  async status({ response }: HttpContext) {
    const employees = await User.query()
      .where('role', 2)
      .leftJoin('statuses', 'users.status', 'statuses.id')
      .select('users.*', 'statuses.status_name as employee_status_name')

    // console.log(employees)
    return response.ok(employees)
  }

  async time({ view }: HttpContext) {
    const times = await Time.query().orderBy('time', 'asc')
    return view.render('time', { times })
  }

  async updateTask({ view, params }: HttpContext) {
    const idTask = params.id
    console.log('task is:', idTask)

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
    const barber = dataBarber.map((b) => b.toJSON())
    const times = await Time.query().orderBy('time', 'asc')
    return view.render('reserve', { barber, times })
  }

  async reserving({ view, auth, request }: HttpContext) {
    const customerId = auth.user!.id
    const { time } = request.only(['time'])
    const selectedBarberId = request.input('barber_id') ?? 0
    console.log('เลือกช่างจาก :', selectedBarberId)

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

      return view.render('reservesuccess', {
        header: 'การจองสำเร็จ',
        message: 'การจองของคุณเสร็จสมบูรณ์แล้ว',
      })
    }
  }
}
