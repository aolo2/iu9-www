const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const fs = require('fs')
const path = require('path')

const routes = require('./routes/routes')
const websocket = require('./handlers/websocket')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'))
const app = express()

app.use(helmet())
app.use(morgan('dev', {stream: accessLogStream}))
app.use(cookieParser())
app.use(bodyParser.json({limit: '5mb'}))
app.use(express.static('public'))
app.use('/', routes)

// app.use((req, res, next) => {
//     const err = new Error('Not Found')
//     err.status = 404
//     next(err)
// })

// NOTE(aolo2): Production error handler: do not leak the stacktrace to the client
// app.use((err, req, res, next) => {
//     res.status(err.status || 500)
//       .set('Content-Type', 'text/plain')
//       .send("Internal exception: " + err.message)
// })

const httpServer = app.listen(3000)
websocket.init(httpServer)