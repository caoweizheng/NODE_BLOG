const { loginVerify } = require('../dataController/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const serverUserHandle = (req, res) => {
  if(req.method === 'POST' && req.path === '/app/user/login') {
    const { username, password } = req.body
    const loginResult = loginVerify(username, password)
    if(loginResult) return new SuccessModel('登录成功')
    return new ErrorModel('登录失败')
  }
  return 
}

module.exports = serverUserHandle