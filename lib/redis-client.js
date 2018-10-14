const redis = require('redis')
const config = require('../config/config.json')

let redis_client = null

function create_redis_client() {
  return redis.createClient({
    'host': config.redis.server.host,
    'port': config.redis.server.port,
    'enable_offline_queue': false
  })
}

function do_client_action(action, callback) {
  if (!redis_client) {
    callback(new Error('redis client is null'))
  } else {
    action(redis_client)
  }
}

function set(key, value, callback) {
  do_client_action((client) => {
    client.set(key, value, callback)
  }, callback)
}

function get(key, callback) {
  do_client_action((client) => {
    client.get(key, callback)
  }, callback)
}

function exists(key, callback) {
  do_client_action((client) => {
    client.exists(key, callback)
  }, callback)
}

function lpush(key, value, callback) {
  do_client_action((client) => {
    client.lpush(key, value, callback)
  }, callback)
}

function lrange(key, from, to, callback) {
  do_client_action((client) => {
    client.lrange(key, from, to, callback)
  }, callback)
}

function del(key, callback) {
  do_client_action((client) => {
    client.del(key, callback)
  }, callback)
}

function sadd(key, member, callack) {
  do_client_action((client) => {
    client.sadd(key, member, callback)
  }, callback)
}

function scard(key, callback) {
  do_client_action((client) => {
    client.scard(key, callback)
  }, callback)
}

function expire(key, seconds, callback) {
  do_client_action((client) => {
    client.expire(key, seconds, callback)
  }, callback)
}

function mget(keys, callback) {
  do_client_action((client) => {
    client.mget(keys, callback)
  }, callback)
}

function mset(pairs, callback) {
  let msetArgs = []
  pairs.forEach((pair) => {
    msetArgs.push(pair.key)
    msetArgs.push(JSON.stringify(pair.val))
  })

  do_client_action((client) =>
    client.mset(msetArgs, callback)
    , callback)
}

module.exports.init = () => {
  redis_client = create_redis_client()
  return this
}

module.exports.set = set
module.exports.get = get
module.exports.exists = exists
module.exports.lpush = lpush
module.exports.lrange = lrange
module.exports.del = del
module.exports.expire = expire
module.exports.mget = mget
module.exports.mset = mset