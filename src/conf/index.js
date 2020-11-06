const env = process.env.NODE_ENV
// const config = require(`./${env}.js`)
const config = require(`./dev.js`)

// 根据环境变量返回对应的配置
module.exports = config