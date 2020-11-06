const http = require('http')

const serverHandle = require('../app')

const server = http.createServer((req, res) => {
  serverHandle(req, res)
})

server.listen(8888, () => {
  console.log('listening port in  8888')
})