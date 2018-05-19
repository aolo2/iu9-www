const express = require('express')

const users = require('../handlers/users')
const roles = require('../handlers/roles')
const news = require('../handlers/news')
const messages = require('../handlers/messages')
const events = require('../handlers/events')

const router = express.Router()
const routerAuth = express.Router({mergeParams : true})

routerAuth.use(users.access_check_middleware)

/* Пользователи */
router.post('/users/signup', users.signup)
router.post('/users/login', users.login)
routerAuth.post('/users/logout', users.logout)
routerAuth.get('/users/applications', users.get_applications)
routerAuth.post('/users/approve', users.approve_application)
routerAuth.patch('/users/info', users.edit_profile)

/* Роли */
routerAuth.get('/roles', roles.get_roles)
routerAuth.post('/roles', roles.create_role)
routerAuth.patch('/roles', roles.edit_role)
routerAuth.delete('/roles', roles.delete_role)

/* Новости */
router.get('/news/public', news.get_public_news)
routerAuth.get('/news', news.get_news)
router.get('/news/edit', news.get_source)
routerAuth.post('/news', news.post_article)
routerAuth.delete('/news', news.delete_article)

/* Диалоги */
routerAuth.post('/messages/im', messages.send_message)
routerAuth.post('/messages/dialog', messages.create_dialog)
routerAuth.delete('/messages/dialog', messages.delete_dialog)

/* События */
routerAuth.post('/events/create', events.create_event)
routerAuth.post('/events/start', events.start_event)
routerAuth.patch('/events', events.edit_event)
routerAuth.delete('/events', events.delete_event)

router.use('/', routerAuth)

module.exports = router;