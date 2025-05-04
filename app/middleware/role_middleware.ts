import type { HttpContext } from '@adonisjs/core/http'

export default class RoleMiddleware {
  public async handle(
    { auth, response }: HttpContext,
    next: () => Promise<void>,
    allowedRoles: number[]
  ) {
    const user = auth.user
    console.log('ข้อมูลสิทธิ์: ', user!.role)

    if (!user) {
      console.log('ไม่พบผู้ใช้')
      return response.redirect().toRoute('users.login')
    }

    // console.log('ข้อมูลสิทธิ์: ', user.role)

    if (user.role !== 1) {
      console.log('ไม่อนุญาต เพราะ สิทธิ์ไม่ถูกต้อง')
      return response.redirect().toRoute('mains.home')
    }

    if (!allowedRoles.includes(user.role)) {
      console.log('ไม่พบสิทธิ์ในระบบ')
      return response.redirect().toRoute('users.login')
    }
    console.log('สิทธิ์ถูกต้อง')
    await next()
  }
}
