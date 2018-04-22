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
  do_client_action((client) => 
    client.collection(usersCollectionName).insertOne(user, callback), callback)
}

function get_user(login, callback) {
  do_client_action((client) => 
    client.collection(usersCollectionName).findOne({'login': login}, callback), callback)
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
const rolesCollectionName = 'roles'
const dialogsCollectionName = 'dialogs'
const newsCollectionName = 'news'
const eventsCollectionName = 'events'

module.exports.add_user = add_user
module.exports.get_user = get_user
module.exports.create_role = create_role
module.exports.get_roles = get_roles