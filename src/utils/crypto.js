const crypto = require('crypto')

const SECRET_KYE = 'JK__123';

function md5 (content) {
  var md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

function genPasswod (password) {
  let str = `password=${password}&key=${SECRET_KYE}`
  return md5(str)
}

let res = genPasswod('123')
console.log(res)
