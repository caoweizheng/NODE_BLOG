const loginVerify = (username, password) => {
  if (username === 'lucy' && password === '12345') return true
  return false
}

module.exports = {
  loginVerify
}