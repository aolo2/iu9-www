const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const app = express()

app.use(bodyParser.json())
app.use('/', routes)
app.use(express.static('public'))

app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
      .set('Content-Type', 'text/plain')
      .send("Internal exception: " + err.message)
})

app.listen(3000)