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


// var process = require("process")
//     version: process.version, //node版本
//     platform: process.platform,//运行的操作系统的环境
//     uptime: process.uptime(),//当前进程运行的时长（秒）
//     pid: process.pid,//进程ID
//     execPath: process.execPath,//当前node进程的执行路径
//     cwd: process.cwd(), //当前工作目录
//     rss: process.memoryUsage().rss, //当前使用内存情况
//     heapTotal: process.memoryUsage().heapTotal,//googleV8内存使用情况
//     heapUsed: process.memoryUsage().heapUsed,//googleV8内存使用情况
//     external: process.memoryUsage().external, //V8管理的，绑定到Javascript的C++对象的内存使用情况
//     cpu: process.arch ,//CPU架构
//     startTime:startTime} //启动时间 毫秒
