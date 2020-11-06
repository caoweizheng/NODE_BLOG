const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../conf/index')

// 创建数据库连接
const connect = mysql.createConnection(MYSQL_CONFIG)

// 连接数据库
connect.connect()

// 暴露操作数据库的 exec
const exec = (sql) => {
  return new Promise((resolve, reject) => {
    try {
      connect.query(sql, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    } catch (error) {
      reject(err)
    }
  })
}

module.exports = {
  exec
}
