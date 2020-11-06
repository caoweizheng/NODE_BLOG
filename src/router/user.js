const { login } = require('../dataController/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const redisHandle = require('../../src/db/redis')

const serverUserHandle = (req, res) => {
  
  if (req.method === 'POST' && req.path === '/app/user/login') {
    const { username, password } = req.body
    if (!username || !password) {
      return Promise.resolve(new ErrorModel('请输入用户名或密码'))
    }
    const loginPromise = login(username, password)
    if (loginPromise) {
      return loginPromise.then(result => {
        if (result.username) {
          // 保存登录状态到redis
          redisHandle.set(req.userId, result)
          return new SuccessModel(`${result.username}, 登录成功`)
        }
        return new ErrorModel('登录失败，用户名或密码错误')
      })
    }
  }
  if (req.method === 'GET' && req.path === '/app/user/login-test') {
    if(req.session && req.session.username) {
      return Promise.resolve(
        new SuccessModel(req.session.username)
      )
    } else {
      return Promise.resolve(
        new ErrorModel('尚未登录')
      )
    }
  }
  return Promise.resolve(
    new ErrorModel('请求失败')
  )
}

module.exports = serverUserHandle