import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import { middleware } from '#start/kernel'
// eslint-disable-next-line @adonisjs/prefer-lazy-controller-import
import MainsController from '#controllers/mains_controller'

router.get('/', ({ response }: HttpContext) => {
  response.redirect().toRoute('mains.home')
})

router
  .group(() => {
    router.get('/home', [MainsController, 'home']).as('mains.home')
    router.get('/status', [MainsController, 'status']).as('mains.status')
    router.get('/time', [MainsController, 'time']).as('mains.time')
    router.get('/reserve', [MainsController, 'reserve']).as('mains.reserve')
    router.post('/transfertask/:id', [MainsController, 'transferTask']).as('mains.transfertask')
    router.post('/updatetask/:id', [MainsController, 'updateTask']).as('mains.updatetask')
    router.post('/deletetask/:id', [MainsController, 'deleteTask']).as('mains.deletetask')
    router.post('/reserving', [MainsController, 'reserving']).as('mains.reserving')
    router.get('/history', [MainsController, 'history']).as('mains.history')
    router.post('/reservetime', [MainsController, 'reserveTime']).as('mains.reservetime')
  })
  .use(middleware.auth())
