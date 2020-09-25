const config = process.env.NODE_ENV
const MYSQL_CONFIG = require(`./${config}.js`)

// 根据环境变量返回对应的配置
module.exports = MYSQL_CONFIG