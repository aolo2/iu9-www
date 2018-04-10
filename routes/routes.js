const express = require('express')
const users = require('../handlers/users')

const router = express.Router()
const routerAuth = express.Router({mergeParams : true})

/* MIDDLEWARE */
routerAuth.use(users.auth_check_middleware)

/* GET */

/* POST */
router.post('/signup', users.signup)
router.post('/restore', users.restore)


/* GET */
routerAuth.get('/news', users.get_news)

/* POST */
routerAuth.post('/news', users.post_news)

router.use('/', routerAuth)

module.exports = router;