var router = {};
var mongoClient = require('mongodb').MongoClient;

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

function conn(host, mongotable) {
    mongoClient.connect(host, {useNewUrlParser: true}, function (err, client) {
        if (err) {
            setTimeout(() => {
                console.log('连接出错' + err);
                conn(host, mongotable);//出错重连
            }, 3000)
            myEmitter.emit("error", err)
        } else {
            console.log('连接mongodbs成功----');
            router.db = client.db(mongotable)
            myEmitter.emit("ready")
        }
    });
}

router.start = function (host, table) {
    console.log("连接mongodb-----")
    conn(host, table);
}
router.findOne = function (table, data) {
    return new Promise((resolve, reject) => {
        router.db.collection(table).findOne(data, function (err, rwos) {
            if (err) {
                myEmitter.emit("error", err)
                resolve({error: err});
            } else {
                resolve({error: null, result: rwos});
            }
        })
    })
}
/**
 * @param table
 * @param data
 * @param skip
 * @param limit
 * @param sort
 * @returns {Promise<any>}
 */
router.find = function (table, data, skip, limit, sort) {
    return new Promise((resolve, reject) => {
        if (typeof data != "object") {
            data = {}
        }
        if (typeof table != "string") {
            throw "function find table parameter not is string "
        }
        let list = router.db.collection(table).find(data)
        if (skip || skip === 0) { //从第多少条开始
            if (typeof skip != "number") {
                throw "function find skip parameter not is number "
            }
            list = list.skip(skip)
        }
        if (limit || skip === 0) {//查询多少条
            if (typeof limit != "number") {
                throw "function find limit parameter not is limit "
            }
            list = list.limit(limit)
        }
        if (sort) { //排序
            if (typeof sort != "object") {
                throw "function find sort parameter not is object "
            }
            list = list.sort(sort)
        }
        list.toArray((err, rows) => {
            if (err) {
                myEmitter.emit("error", err)
                resolve({error: err})
            }
            resolve({error: null, result: rows});
        })
    })

}
/**同步修改单条
 * @param table 表明
 * @param data  条件
 * @param value  修改数据
 * @returns {Promise<any>}
 */
router.updateOne = function (table, data, value) {
    return new Promise((resolve, reject) => {
        router.db.collection(table).updateOne(data, value, function (err) {
            if (err) {
                myEmitter.emit("error", err)
                resolve({error: err})
            } else {
                resolve({error: null, result: true});
            }
        })
    })

}
/** 异步修改单条
 * @param table 表明
 * @param data  条件
 * @param value  修改数据
 * @returns {Promise<any>}
 */
router.ExupdateOne = function (table, data, value) {
    router.db.collection(table).updateOne(data, value, function (err) {
        if (err) {
            myEmitter.emit("error", err)
            console.error(err)
        }
    })
}
/**同步修改满足条件的
 * @param table 需要修改的表
 * @param data  条件
 * @param value 需要修改的列和值
 * @param upsert 有则修改没有则插入 默认false
 */
router.updateAll = function (table, data, value, upsert) {
    return new Promise((resolve, reject) => {
        router.db.collection(table).updateMany(data, value, {upsert: upsert || false}, (err, row) => {
            if (err) {
                myEmitter.emit("error", err)
                resolve({error: err})
            } else {
                resolve({error: null, result: row});
            }
        })
    })
}

/**异步修改满足条件的ExupdateAll (table, data, value)
 * @param table 需要修改的表
 * @param data  条件
 * @param value 需要修改的列和值
 */
router.ExupdateAll = function (table, data, value) {
    router.db.collection(table).updateMany(data, value, (err) => {
        if (err) {
            myEmitter.emit("error", err)
            console.error(err)
        }
    })

}

/**同步删除单条 deleteOne (table, data)
 * @param table 需要修改的表
 * @param data  条件
 */
router.deleteOne = function (table, data) {
    return new Promise((resolve, reject) => {
        router.db.collection(table).deleteOne(data, (err) => {
            if (err) {
                myEmitter.emit("error", err)
                resolve({error: err})
            } else {
                resolve({error: null, result: true});
            }
        })
    })
}

/**异步删除单条ExdeleteOne (table, data)
 * @param table 需要修改的表
 * @param data  条件
 */
router.ExdeleteOne = function (table, data) {
    router.db.collection(table).deleteOne(data, (err) => {
        if (err) {
            myEmitter.emit("error", err)
            console.error(err)
        }
    })
}


/**同步删除满足条件的deleteAll(table, data)
 * @param table 需要修改的表
 * @param data  条件
 */
router.deleteAll = function (table, data) {
    return new Promise((resolve, reject) => {
        router.db.collection(table).deleteMany(data, (err) => {
            if (err) {
                myEmitter.emit("error", err)
                resolve({error: err})
            } else {
                resolve({error: null, result: true})
            }
        })
    })
}


/**异步删除满足条件的ExdeleteAll (table, data)
 * @param table 需要修改的表
 * @param data  条件
 */
router.ExdeleteAll = function (table, data) {
    router.db.collection(table).deleteMany(data, (err) => {
        if (err) {
            myEmitter.emit("error", err)
            console.error(err)
        }
    })
}

router.event = myEmitter
module.exports = router
