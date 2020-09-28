const { login } = require('../dataController/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')


const serverUserHandle = (req, res) => {
  if (req.method === 'GET' && req.path === '/app/user/login') {
    const { username, password } = req.query
    if (!username || !password) return new ErrorModel('请输入用户名或密码')
    const loginPromise = login(username, password)

    if (loginPromise) {
      return loginPromise.then(result => {
        if (result.username) {
          
          req.session.username = result.username
          req.session.realname = result.realname
          console.log('req.session is ', req.session)
          return new SuccessModel(`${result.username}, 登录成功`)
        }
        return new ErrorModel('登录失败，请重新登录')
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
  return
}

module.exports = serverUserHandle