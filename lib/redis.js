var redis = require('redis');
var router = {}
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

router.start = function (data) {
    console.log("redis 连接 ----")
    myEmitter.emit('start', data); //触发事
    router.client = redis.createClient(data.port, data.host);
    router.client.on("error", function (error) {
        console.error(error)
        setTimeout(() => {
            start(data)
            console.log('redis 重连 ---- ');
        }, 3000)
        myEmitter.emit('error', err); //触发事
    })
    if (data.verification) { //是否密码登录
        router.client.auth(config.redis.pwd, function (err) {
            console.error(err)
        });
    }
    router.client.on('ready', function (err) {
        console.log('redis 连接成功 ---- ');
        myEmitter.emit('ready'); //触发事
    });
}

/**
 *同步set set(key, value, expire, pexpireat)
 * @param key
 * @param value
 * @param expire 过期时间 可以字符串
 * @param pexpireat 是否使用毫秒
 * @returns {Promise<any>}
 */
router.set = function (key, value, expire, pexpireat) {
    return new Promise((resolve, reject) => {
        router.client.set(key, value, function (err, result) {
            if (err) {
                console.error(err)
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            }
            if (expire) {
                if (pexpireat) {
                    client.pexpire(key, parseInt(expire));
                } else {
                    client.expire(key, parseInt(expire));
                }
            }
            resolve({error: null})
        })
    })
}
/***
 * 异步set Exset(key, value, expire, pexpireat)
 * @param key
 * @param value
 * @param expire
 * @param pexpireat
 * @constructor
 */
router.Exset = function (key, value, expire, pexpireat) {
    router.client.set(key, value, function (err, result) {
        if (err) {
            console.error(err)
            myEmitter.emit('error', err); //触发错误事件
        }
        if (expire) {
            if (pexpireat) {
                client.pexpire(key, parseInt(expire));
            } else {
                client.expire(key, parseInt(expire));
            }
        }
    })
}

/**
 *同步get get(key)
 * @param key
 * @returns {Promise<any>}
 */
router.get = function (key) {
    return new Promise((resolve, reject) => {
        router.client.get(key, (err, value) => {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err});
            }
            resolve({error: null, result: value});
        });

    })
}

/**
 * 同步递减 值必须是数字 incr(key)
 * @param key
 * @returns {Promise<any>}
 */
router.incr = function (key) { //
    return new Promise((resolve, reject) => {
        router.client.multi().incr(key).exec(function (err, reply) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            } else {
                resolve({error: null})
            }
        });

    })
}

/***
 * 异步递减 值必须是数字 Exincr(key)
 * @param key
 * @constructor
 */
router.Exincr = function (key) { //递增 异步
    router.client.multi().incr(key).exec(function (err, reply) {
        if (err) {
            myEmitter.emit('error', err); //触发错误事件
            console.error(err)
        }
    });
}

/**
 * 从尾部push List
 * @param key
 * @param value
 */
router.rpush = function (key, value) {
    return new Promise((resolve, reject) => {
        router.client.rpush(key, value, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            } else {
                resolve({error: null, result: res})
            }
        })
    })
}

/**
 * 异步新增list
 * @param key
 * @param value
 * @returns {Promise<any>}
 * @constructor
 */
router.Exrpush = function (key, value) {
    router.client.rpush(key, value, function (err, res) {
        if (err) {
            myEmitter.emit('error', err); //触发错误事件
            console.error(err)
        }
    })
}

/**
 * 同步 删除list lrem(key, num, flag)
 * @param key
 * @param num 删除个数
 * @param flag 指定内容
 * @returns {Promise<any>}
 */
router.lrem = function (key, num, flag) {
    return new Promise((resolve, reject) => {
        router.client.lrem(key, num, flag, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            } else {
                resolve({error: null, result: res})
            }
        });
    })
}

/**
 * 异步删除list Exlrem (key, num, flag)
 * @param key
 * @param num
 * @param flag
 * @constructor
 */
router.Exlrem = function (key, num, flag) {
    router.client.lrem(key, num || 1, flag, function (err, res) {
        if (err) {
            myEmitter.emit('error', err); //触发错误事件
            console.error(err)
        }
    });
}

/**
 *同步获取全部List
 * @param key
 * @param startSum 开始位数
 * @param stopSum  结束位数 -1为全部
 * @returns {Promise<any>}
 */
router.lrange = function (key, startSum, stopSum) { //获取全部List
    return new Promise((resolve, reject) => {
        router.client.lrange(key, startSum || 0, stopSum || -1, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            } else {
                resolve({error: null, result: res})
            }
        });

    })
}

/**
 * 同步获取hash
 * @param key
 * @returns {Promise<any>}
 */
router.hgetall = function (key) { //
    return new Promise((resolve, reject) => {
        router.client.hgetall(key, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            } else {
                resolve({error: null, result: res})
            }
        });
    })
}
/**
 *同步获取指定hash hget (hashkey, key)
 * @param key
 * @param value
 * @returns {Promise<any>}
 */
router.hget = function (hashkey, key) {
    return new Promise((resolve, reject) => {
        router.client.hget(key, value, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            } else {
                resolve({error: null, result: res})
            }
        });

    })
}

/**
 * 同步设置hash  hset(hashkey, key, value)
 * @param hashkey
 * @param key
 * @param value
 * @returns {Promise<any>}
 */
router.hset = function (hashkey, key, value) {
    return new Promise((resolve, reject) => {
        router.client.hset(hashkey, key, value, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                resolve({error: err})
            } else {
                resolve({error: null, result: res})
            }
        });
    })
}
/**
 * 异步设置hash Exhset(hashkey, key, value)
 * @param hashkey
 * @param key
 * @param value
 * @constructor
 */
router.Exhset = function (hashkey, key, value) {
    router.client.hset(hashkey, key, value, function (err, res) {
        if (err) {
            myEmitter.emit('error', err); //触发错误事件
            console.error(err)
        }
    });

}
router.event = myEmitter
module.exports = router