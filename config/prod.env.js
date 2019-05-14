const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"production"',
  FORUM_URL: '"http://acm.wh.sdu.edu.cn:8081"'
})
