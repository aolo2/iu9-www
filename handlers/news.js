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

function post_article(req, res) {
  if (req.body.header.length > 80) {
    common.send_bad_request_response(res, "max header length (80 chars) exceeded")
    return
  }

  if (req.body.header.length > 100000) {
    common.send_bad_request_response(res, "max article length (100k chars) exceeded")
    return
  }

  if ('article_id' in req.body) {
    /* Edit article */
    let article = {
      'markdown': req.body.source,
      'header': req.body.header
    }

    if ('author' in req.body)
      article.author = req.body.author
    if ('public' in req.body)
      article.public = req.body.public

    db.update_article(req.body.article_id, article, (err) => {
      if (err) {
        common.send_error_response(res, err.message)
      } else {
        common.send_text_response(res, 200)
      }
    })
  } else {
    /* Submit article */
    const article = {
      'markdown': req.body.source,
      'header': req.body.header,
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
module.exports.post_article = post_article
module.exports.edit_article = edit_article
module.exports.delete_article = delete_article