import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { register } from '#validators/register'
import { login } from '#validators/login'

export default class UsersController {
  async registerform({ view }: HttpContext) {
    return view.render('register')
  }

  async register({ request, view, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(register)

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const e_mail = payload.email.toString()
      const existingUser = await User.findBy('email', e_mail)

      if (existingUser) {
        session.flash('errors', 'อีเมล์นี้ถูกใช้ไปแล้ว')
      }

      const user = await User.create({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        role: 3,
        status: 1,
      })

      console.log(`สมัครสมาชิก ${user.fullName} สำเร็จ`)

      return view.render('login')
    } catch (error) {
      console.log('error', error)
      if (error.messages) {
        session.flash('errors', error.messages.message)
      }

      throw error
    }
  }

  async login({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(login)

    try {
      const user = await User.verifyCredentials(payload.email, payload.password)

      await auth.use('web').login(user)
      console.log('เข้าสู่ระบบสำเร็จ')

      return response.redirect().toRoute('mains.home')
    } catch (error) {
      console.log('Login error:', error)

      if (error.code === 'E_INVALID_CREDENTIALS') {
        response.redirect().toRoute('users.login')
        session.flash('errors', ['อีเมลหรือรหัสผ่านไม่ถูกต้อง'])
      } else {
        session.flash('errors', error.messages.message)
      }
    }
  }

  async logout({ auth, response, params }: HttpContext) {
    const user = await User.find(params.id)

    if (user) {
      user.status = 1
      await user.save()
      console.log(`ข้อมูลสิทธิ์: ${user.id} ถูกอัพเดทเรียบร้อย`)
    } else {
      console.log(`ข้อมูลสิทธิ์: ${params.id} ไม่ถูกอัพเดท`)
    }

    await auth.use('web').logout()
    response.redirect().toRoute('login')
  }
}
