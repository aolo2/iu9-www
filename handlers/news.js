const marked = require('marked')

const common = require('./common')
const db = require('../lib/db')


function get_news(req, res) {
  db.get_news(req, (err, news) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, news)
    }
  })
}

function get_public_news(req, res) {
  get_news(req, res)
}

function post_article(req, res) {
  if (req.body.header.length > 80) {
    common.send_bad_request_response(res, "max header length (80 chars) exceeded")
    return
  }

  if (req.body.header.length > 100000) {
    common.send_bad_request_response(res, "max article length (100k chars) exceeded")
    return
  }

  /* Submit article */
  const article = {
    'header': req.body.header,
    'timestamp': new Date(),
    'author': req.user_db.login,
    'public': req.body.public,
    'target': req.body.target
  }

  if (article.target === 'student') {
    article.target = {'role': 'student', 'group': req.body.studentGroup}
  }

  db.addEditbox(req.body.source, (err, boxId) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      article.boxId = boxId
      db.post_news_article(article, (err) => {
        if (err) {
          common.send_error_response(res, err.message)
        } else {
          common.send_text_response(res, 200)
        }
      })
    }
  })
}

function delete_article(req, res) {
  db.delete_article(req.body.article_id, (err) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

module.exports.get_news = get_news
module.exports.get_public_news = get_public_news
module.exports.post_article = post_article
module.exports.delete_article = delete_article