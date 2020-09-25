const querystring = require('querystring')
const serverBlogHandle = require('./src/router/blog')
const serverUserHandle = require('./src/router/user')

const serverHandle = (req, res) => {
  res.setHeader('content-type', 'application/json')

  // 获取接口地址
  const url = req.url
  req.path = url.split('?')[0]

  req.query = querystring.parse(url.split('?')[1])

  getPostData(req).then(postData => {
    req.body = postData
    let blogData = serverBlogHandle(req, res)
    if (blogData) {
      blogData.then(result => {
        res.end(
          JSON.stringify(result)
        )
      })
      return
    }
    let userData = serverUserHandle(req, res)

    if (userData) {
      res.end(
        JSON.stringify(userData)
      )
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
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
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