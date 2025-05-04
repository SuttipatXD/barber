import router from '@adonisjs/core/services/router'
// eslint-disable-next-line @adonisjs/prefer-lazy-controller-import
import UsersController from '#controllers/users_controller'

router.on('/login').render('login').as('login')

router.post('/login', [UsersController, 'login']).as('users.login')
router.get('/logout/:id', [UsersController, 'logout']).as('users.logout')
router.get('/registerform', [UsersController, 'registerform']).as('users.registerform')
router.post('/register', [UsersController, 'register']).as('users.register')

// router.get('/create_user', async () => {
//   const user = await User.create({ id: 1, user_name: 'user1', password: 'user1' })
//   console.log(user.user_name + ' is created!')
// })
