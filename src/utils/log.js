const fs = require('fs')
const path = require('path')

// 创建写入流
function createWriteStream(fileName) {
  const fullName = path.join(__dirname, '../', 'logs', fileName)
  const writeStream = fs.createWriteStream(fullName, {
    flags: 'a'
  })
  return writeStream
}

// 写日志
function writeStreamLog(writeStream, log) {
  writeStream.write(log + '\n') // 写log
}

// 写访问日志
const writeStream = createWriteStream('access.log') 
function access(log) {
  writeStreamLog(writeStream,log)
}

module.exports = {
  access
}