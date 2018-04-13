const express = require('express')
const users = require('../handlers/users')

const router = express.Router()
const routerAuth = express.Router({mergeParams : true})

/* MIDDLEWARE */
routerAuth.use(users.auth_check_middleware)

/* GET */
routerAuth.get('/news', users.get_news)

/* POST */
router.post('/signup', users.signup)
router.post('/login', users.login)
routerAuth.post('/news', users.post_news)
routerAuth.post('/logout', users.logout)

router.use('/', routerAuth)

module.exports = router;