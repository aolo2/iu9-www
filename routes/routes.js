const express = require('express')

const news = require('../handlers/news')
const users = require('../handlers/users')
const roles = require('../handlers/roles')
const events = require('../handlers/events')
const editbox = require('../handlers/editbox')
const messages = require('../handlers/messages')

const router = express.Router()
const router_auth = express.Router({mergeParams : true})

router_auth.use(users.access_check_middleware)

/* Пользователи */
router.post('/users/signup', users.signup)
router.post('/users/login', users.login)
router_auth.post('/users/logout', users.logout)
router_auth.get('/users/applications', users.get_applications)
router_auth.post('/users/approve', users.approve_application)
router_auth.patch('/users/info', users.edit_profile)

/* Роли */
router_auth.get('/roles', roles.get_roles)
router_auth.post('/roles', roles.create_role)
router_auth.patch('/roles', roles.edit_role)
router_auth.delete('/roles', roles.delete_role)

/* Новости */
router.get('/news/public', news.get_public_news)
router_auth.get('/news', news.get_news)
router.get('/news/edit', news.get_source)
router_auth.post('/news', news.post_article)
router_auth.delete('/news', news.delete_article)

/* Диалоги */
router_auth.post('/messages/im', messages.send_message)
router_auth.post('/messages/dialog', messages.create_dialog)
router_auth.delete('/messages/dialog', messages.delete_dialog)

/* События */
router_auth.post('/events/create', events.create_event)
router_auth.post('/events/start', events.start_event)
router_auth.patch('/events', events.edit_event)
router_auth.delete('/events', events.delete_event)

/* Редактирование текста */
router.get('/editbox', editbox.getHTML)
router.get('/editbox/source', editbox.getSource)
router.post('/editbox/source', editbox.updateSource)

router.use('/', router_auth)

module.exports = router;