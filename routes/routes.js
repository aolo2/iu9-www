const express = require('express')

const news = require('../handlers/news')
const users = require('../handlers/users')
const files = require('../handlers/files')
const events = require('../handlers/events')
const editbox = require('../handlers/editbox')
const websocket = require('../handlers/websocket')

const router = express.Router()
const router_auth = express.Router({mergeParams: true})

router_auth.use(users.access_check_middleware)

/* Пользователи */
router.post('/users/signup', users.signup)
router.post('/users/login', users.login)
router_auth.get('/users', users.get)
router_auth.post('/users/add', users.add)
router_auth.post('/users/logout', users.logout)
router_auth.get('/users/applications', users.get_applications)
router_auth.post('/users/approve', users.approve_application)
// router_auth.patch('/users/info', users.edit_profile)
router_auth.get('/users/groups', users.getGroups)
router_auth.get('/users/events', users.getEvents)

/* Новости */
router.get('/news/public', news.get_public_news)
router_auth.get('/news', news.get_news)
router_auth.post('/news', news.post_article) // NOTE(aolo2, important): unsanitized!
router_auth.delete('/news', news.delete_article) // приделать кнопку или удалить

/* События */
router_auth.post('/event/create', events.create)
router_auth.delete('/event', events.finishEvent)
router_auth.get('/event', events.getEvent)
router_auth.get('/events/subjects', events.getSubjects)
router_auth.get('/events/types', events.getTypes)

/* Редактирование текста */
router.get('/editbox', editbox.getHTML)
router_auth.get('/editbox/source', editbox.getSource)
router_auth.patch('/editbox/source', editbox.updateSource) // NOTE(aolo2, important): unsanitized!

/* Файлы */
router_auth.post('/files/upload', files.upload)

router.use('/', router_auth)

module.exports = router;