const mongodb = require('mongodb')
const config = require('../config/config.json')

let mongo_client = null

function do_client_action(action, callback) {
  if (!mongo_client) {
    callback(new Error('mongo client is null'))
  } else {
    action(mongo_client)
  }
}

function add_user(user, callback) {
  do_client_action((client) => {
    user['_id'] = mongodb.ObjectId(user['_id'])
    client.collection(usersCollectionName).insertOne(user, callback), callback 
  })
}

function get_user(login, callback) {
  do_client_action((client) => 
    client.collection(usersCollectionName).findOne({'login': login}, callback), callback)
}

function add_user_application(application, callback) {
  do_client_action((client) =>
    client.collection(applicationsCollectionName).insertOne(application, callback), callback)
}

function create_role(role, callback) {
  do_client_action((client) => 
    client.collection(rolesCollectionName).insertOne(role, callback), callback)
}

function get_roles(titles, callback) {
  do_client_action((client) => 
    client.collection(rolesCollectionName)
    .find({'name': {'$in': titles}})
    .toArray((err, items) => {
      if (err) {
        callback(err)
      } else {
        callback(null, items)
      }
    }), callback)
}

function get_news(query, callback) {
  do_client_action((client) =>
    client.collection(newsCollectionName)
    .find(query)
    .toArray(callback), callback)
}

function get_article_source(article_id, callback) {
  do_client_action((client) =>
    client.collection(newsCollectionName)
    .findOne({'_id': mongodb.ObjectId(article_id)}, callback))
}

function update_article(article_id, article, callback) {
  let set_query = {
    '$set': {
      'markdown': article.markdown,
      'header': article.header
    }
  }

  if ('author' in article)
    set_query['$set']['author'] = article.author
  if ('public' in article)
    set_query['$set']['public'] = article.public

  do_client_action((client) => 
    client.collection(newsCollectionName)
    .updateOne({'_id': mongodb.ObjectId(article_id)}, set_query, callback), callback)
}

function get_user_applications(callback) {
  do_client_action((client) => 
    client.collection(applicationsCollectionName)
    .find({}).toArray(callback), callback)
}

function approve_application(application_id, callback) {
  do_client_action((client) => 
    client.collection(applicationsCollectionName)
    .removeOne({'_id': mongodb.ObjectId(application_id)}, callback), callback)
}

function post_news_article(article, callback) {
  do_client_action((client) => 
    client.collection(newsCollectionName)
    .insertOne(article, callback), callback)
}

function delete_news_article(article_id, callback) {
  do_client_action((client) =>
    client.collection(newsCollectionName)
    .removeOne({'_id': mongodb.ObjectId(article_id)}, callback), callback)
}

module.exports.init = () => {
  mongodb.MongoClient.connect(config.mongo.url, (err, client) => {
    if (!err) {
      mongo_client = client.db(config.mongo.db_name)
      
      mongo_client
      .collection(usersCollectionName)
      .ensureIndex('login', {unique: true}, (err) => {})
    }
  })

  return this
}

const usersCollectionName = 'users'
const applicationsCollectionName = 'applications'
const rolesCollectionName = 'roles'
const dialogsCollectionName = 'dialogs'
const newsCollectionName = 'news'
const eventsCollectionName = 'events'

module.exports.add_user = add_user
module.exports.get_user = get_user
module.exports.add_user_application = add_user_application
module.exports.get_user_applications = get_user_applications
module.exports.approve_application = approve_application
module.exports.create_role = create_role
module.exports.get_roles = get_roles
module.exports.get_news = get_news
module.exports.get_article_source = get_article_source
module.exports.update_article = update_article
module.exports.post_news_article = post_news_article
module.exports.delete_news_article = delete_news_article