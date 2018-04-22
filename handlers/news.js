const common = require('./common')

function get_news(req, res) {
  common.send_text_response(res, 200)
}

function post_article(req, res) {
  common.send_text_response(res, 200)  
}

function edit_article(req, res) {
  common.send_text_response(res, 200)  
}

function delete_article(res, res) {
  common.send_text_response(res, 200)  
}

module.exports.get_news = get_news
module.exports.post_article = post_article
module.exports.edit_article = edit_article
module.exports.delete_article = delete_article