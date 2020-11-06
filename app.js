const querystring = require('querystring')
const serverBlogHandle = require('./src/router/blog')
const serverUserHandle = require('./src/router/user')
const redisHandle = require('./src/db/redis')
const { access } = require('./src/utils/log')

const SESSION_DATA = {}

const getCookieExpires = () => {
  let date = new Date()
  date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
  return date.toGMTString()
}

// 将字符串格式的cookie转成对象格式
const getCookie = (req) => {
  const cookieObj = {}
  let cookieStr = req.headers['cookie'] || ''
  cookieStr.split(';').forEach(item => {
    if(!item) return ;
    let key = item.split('=')[0].trim()
    let val = item.split('=')[1].trim()
    cookieObj[key] = val
  });
  return cookieObj
}

const serverHandle = async (req, res) => {
  // 记录日志
  access(`${req.method} -- ${req.url} -- ${Date.now()}`)
  res.setHeader('content-type', 'application/json')

  // 获取接口地址
  const url = req.url
  req.path = url.split('?')[0]
  // 解析query
  req.query = querystring.parse(url.split('?')[1])
  // 解析cookie
  req.cookie = getCookie(req)

  // 解析session
  let needSetCookie = false
  let userId = req.cookie.userid

  console.log(userId)

  if(userId) {
    // if(!SESSION_DATA[userId]) {
      // SESSION_DATA[userId] = {}
      // }
    req.userId = userId
    const userInfo = await redisHandle.get(userId)
    req.session = userInfo
  } else {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    req.userId = userId
    // SESSION_DATA[userId] = {}
    redisHandle.set(userId, {})
  }


  getPostData(req).then(postData => {
    req.body = postData
    let blogData = serverBlogHandle(req, res)
    if (blogData) {
      blogData.then(result => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(result)
        )
      })
      return
    }
    let userData = serverUserHandle(req, res)
    if (userData) {
      userData.then(loginRes => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(loginRes)
        )
      })
      return
    }

    // 没有匹配到路由，返回 404
    res.writeHead(404, {
      'content-type': 'text/plain'
    })
    res.write('404 Not Found\n ')
    res.end()
  })
}

function getPostData (req) {
  return new Promise((resolve, reject) => {
    console.log("req.headers['content-type']:", req.headers['content-type'])
    if (req.method !== 'POST' || !req.headers['content-type'].includes('application/json')) {
      return resolve({})
    }
    let data = '';
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      if (!data) return resolve({})
      resolve(
        JSON.parse(data.toString())
      )
    })
  })
}

module.exports = serverHandle