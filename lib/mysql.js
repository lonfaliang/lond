var mysql = require('mysql');
var router = {}
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
var op = {}
let startMysqocoent = (database) => {//
    var pool = mysql.createPool({
        connectionLimit: database.connectionLimit || 10,
        host: database.HOST || '127.0.0.1',
        user: database.USERNAME || 'root',
        password: database.PASSWORD || 'root',
        database: database.DATABASE || 'test',
        multipleStatements: database.multipleStatements || false,
        useConnectionPooling: true
    });
    pool.getConnection((err, connection) => {

        router.conn = connection
        if (err) {
            setTimeout(() => {
                startMysqocoent(database);
            }, 3000)
            console.error(err)
            return connection;
        } else {
            console.log("连接mysql成功----")
            myEmitter.emit("ready")
        }

        myEmitter.emit('start', start); //触发事
        connection.on('error', function (obj) {
            console.log("mysql断开连接" + obj + "3s后重连")
            myEmitter.emit('error', err); //触发事
            startMysqocoent(database);
        })
    });
}


router.start = (startType) => {
    console.log("连接mysql-----")
    startMysqocoent(startType);
    op = startType
}

setInterval(() => {//数据库防错机制出错后强制重连
    conn.query("select 0", (err, rows) => {
        if (err) {
            console.log("强制重连数据库。。。。。")
            startMysqocoent(op);
        }
    });
}, 60000)

router.query = (sql, values) => { //同步执行sql
    return new Promise((resolve, reject) => {
        router.conn.query(sql, values, (err, rows) => {
            if (err) {
                myEmitter.emit('error', err); //触发error
                resolve({error: err});
            } else {
                resolve({error: null, result: rows});
            }
        })
    })

}

router.Exquery = (sql, values) => {//异步执行sql
    router.conn.query(sql, values, (err, rows) => {
        if (err) {
            myEmitter.emit('error', err); //触发error
            console.error("mysql err" + err)
        }
    })
}
router.event = myEmitter
module.exports = router