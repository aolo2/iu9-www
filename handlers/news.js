const marked = require('marked')
const common = require('./common')
const db = require('../lib/db')
const config = require('../config/config.json')

function get_news(req, res) {
  db.getNews(config.news_uuid, (err, result) => {
    if (err) {
      common.send_error_response(res, err.message)
      return
    }
    common.send_json_response(res, result)
  })
}

function post_news(req, res) {
  if (!req.body.news) {
    common.send_bad_request_response(res)
    return
  }

  db.validateSession(req.cookies.SESSIONID, config.roles.post_news, (err, user) => {
    if (err || !user.valid) {
      common.send_bad_login_response(res)
    } else {
      const author = (user.last_name + ' ' + user.first_name[0] + '.')
      const timestamp = Date.now()
      const news_html = marked(req.body.news)
      db.postNews(config.news_uuid, {'author': author, 'timestamp': timestamp, 'body': news_html}, (err) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          common.send_text_response(res, 200)
        }
      })
    }
  })
}

module.exports.get_news = get_news
module.exports.post_news = post_news