import vine from '@vinejs/vine'

export const register = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(1),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value, field) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(6).confirmed(),
    password_confirmation: vine.string().minLength(6),
  })
)
