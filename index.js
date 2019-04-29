var Lond = {}
Lond.startMysql = function (options) {
    require('./lib/mysql')["start"](options)//初始化模板
    Lond.mysql = require('./lib/mysql')
}
Lond.startMongoDB = function (options) {
    require('./lib/mongo')["start"](options.host, options.table)//初始化模板
    Lond.mongod = require('./lib/mongo')
}
Lond.startRedis = function (options) {
    require('./lib/redis')["start"](options)//初始化模板
    Lond.redis = require('./lib/redis')
}
Lond.lond = require('./lib/public')
Lond.zip = require('./lib/lz') //消息压缩和解压
module.exports = Lond

