const common = require('./common')
const db = require('../lib/db')
const marked = require('marked')

function get_news(req, res) {
  db.get_news(req, (err, news) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      news.forEach((article) => { article.html = marked(article.markdown) })
      common.send_json_response(res, news)
    }
  })
}

function get_public_news(req, res) {
  get_news(req, res)
}

function get_source(req, res) {
  db.get_article_source(req.query.article_id, (err, article) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_json_response(res, article)
    }
  })
}

function update_source(req, res) {
  const source = req.body.source
  const html = marked(source)
  db.update_article_source(req.body.article_id, source, html, (err) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function post_article(req, res) {
  if (req.body.article_header.length > 80) {
    common.send_bad_request_response(res, "max header length (80 chars) exceeded")
    return
  }

  if (req.body.article_header.length > 100000) {
    common.send_bad_request_response(res, "max aricle length (100k chars) exceeded")
    return
  }

  const article = {
    'markdown': req.body.source,
    'header': req.body.article_header,
    'timestamp': new Date(),
    'author': req.user_db.login,
    'public': req.body.public
  }

  db.post_news_article(article, (err) => {
    if (err) {
      common.send_error_response(res, err.message)
    } else {
      common.send_text_response(res, 200)
    }
  })
}

function edit_article(req, res) {
  common.send_text_response(res, 200)  
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
module.exports.get_source = get_source
module.exports.update_source = update_source
module.exports.post_article = post_article
module.exports.edit_article = edit_article
module.exports.delete_article = delete_article