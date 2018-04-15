const express = require('express')
const users = require('../handlers/users')
const news = require('../handlers/news')

const router = express.Router()
const routerAuth = express.Router({mergeParams : true})

routerAuth.use(users.auth_check_middleware)

router.post('/signup', users.signup)
router.post('/login', users.login)
routerAuth.get('/news', news.get_news)
routerAuth.post('/news', news.post_news)
routerAuth.post('/logout', users.logout)

router.use('/', routerAuth)

module.exports = router;