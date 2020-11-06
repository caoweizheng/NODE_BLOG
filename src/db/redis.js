const redis = require('redis')

const { REDIS_CONFIG } = require('../conf/index')

const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host)

redisClient.on('error', err => {
  console.error(err)
})


const set = (key, val) => {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

const get = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (error, val) => {
      if (error) {
        return reject(error)
      }
      if (val === null) {
        return resolve(null)
      }
      try {
        resolve(
          JSON.parse(val)
        )
      } catch (error) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  set,
  get
}