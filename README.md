# 简介：
1、lond 封装了mysql mongodb redis 及其他一些常用方法 简化了操作 </br>

2、基于模块 crypto mysql mongodb redis</br>

3、参数返回格式 会返回error参数 如果error不为null就说明sql出错 {error:null,result:true}</br>

4、每个模块都会有ready、error事件</br>

5、初始化模块会触发start事件 初始化完成会触发ready事件 报错会触发error事件</br>

6、可以根据需要增加加载模块


## 注意事项：
 1、lond刚提交为测试期如果有建议和问题可直接联系作者</br>
 2、lond使用数据库时必须初始化否则获取不到连接对象</br>
 3、一定要监听ready、error事件</br>
 4、项目均开源安装后直接在 /node_modules/lond 包里面获取的就是源码

### redis实例
 ```javascript
var lond = require("lond")
var re = {
    port: 6379,
    host: '127.0.0.1',
};
lond.startRedis(re) //初始化
lond.redis.event.on("ready",async (data)=>{//成功触发事件
    console.log("连接成功触发事件")
    await lond.redis.Exset("test","test0000") //同步set
    var val  = await lond.redis.get("test") //同步get
    if(val.error){
        console.log("redis出错"+val.error)
    }else{
        console.log("redis get成功"+val.result)
    }

})
lond.redis.event.on("error",(err)=>{//失败触发事件
    console.log("连接失败"+err)
})


setTimeout(()=>{  //可以非嵌套运用  这里延迟一秒执行 如果程序启动直接运行会报错（连接数据库会耗时）
    await lond.redis.Exset("test","test0000") //同步set
    var val  = await lond.redis.get("test") //同步get
    if(val.error){
        console.log("redis出错"+val.error)
    }else{
        console.log("redis get成功"+val.result)
    }
},1000)
```

### mongodb实例
 ```javascript
var lond = require("lond")
var options = {
    host: 'mongodb://192.168.0.5:27017/node_club_test',
    table: "node_club_test"
};
lond.startMongoDB(options)
lond.mongod.event.on("ready",async (data)=>{//成功触发事件
    //连接成功
  let user = await lond.mongod.find("users",{}) //同步查询
    if(user.error){ //查询出错
        console.log(user.error)
    }else{
        console.log(user.result)
    }
})
lond.mongod.event.on("error",async (err)=>{//错误处理
    console.error(err)
})

setTimeout(()=>{  //可以非嵌套运用  这里延迟一秒执行 如果程序启动直接运行会报错（连接数据库会耗时）
   let user = await lond.mongod.find("users",{}) //同步查询
     if(user.error){ //查询出错
         console.log(user.error)
     }else{
         console.log(user.result)
     }
},1000)

```
### mysql实例

 ```javascript

 var lond = require("lond")
 var options = {
     DATABASE: 'URQuantDB',
     USERNAME: 'root',
     PASSWORD: 'Root!!2018',
     PORT: '3306',
     HOST: '192.168.0.5',
     connectionLimit: 30,
     multipleStatements: true
 }

 lond.startMysql(options) //初始化Mysql模块 并得到mysql链接实例

 lond.mysql.event.on("ready", async (data) => {//成功触发事件
     let uer = await lond.mysql.query("select * from test")//查询
     if (uer.error) {
         console.log(uer.error)
     } else {
         console.log(uer.result)
     }
     lond.mysql.Exquery("update from set a = ?",['value'])//异步修改
 })
 lond.mysql.event.on("error", async (err) => {//错误处理
     console.error(err)
 })


 setTimeout(()=>{  //可以非嵌套运用  这里延迟一秒执行 如果程序启动直接运行会报错（连接数据库会耗时）
     let uer = await lond.mysql.query("select * from test")
        if (uer.error) {
            console.log(uer.error)
        } else {
            console.log(uer.result)
        }
     lond.mysql.Exquery("update from set a = ?",['value'])//异步修改
 },1000)


```


## 安装部署
 1、运行 npm install lond 直接将lond包安装包到项目

 2、引入
 ```javascript
  var lond = require('lond')
```
## 初始化
### 初始化mysql
 ```javascript
   var options = {
        DATABASE: 'URQuantDB',
        USERNAME: 'root',
        PASSWORD: 'Root!!2018',
        PORT: '3306',
        HOST: '192.168.0.5',
        connectionLimit: 30,
        multipleStatements: true
    }
    lond.startMysql(options) //初始化Mysql模块 并得到mysql链接实例
```
### 初始化mongodb
 ```javascript
 var options = {
         host: 'mongodb://127.0.0.1:27017/node_club_test',
         table: "node_club_test"
    };
 lond.startMongoDB(options)
```
### 初始化redis
 ```javascript
 var options = {
     port: 6379,
     host: '192.168.0.5',
 };
 lond.startRedis(options)
```
## 监听事件
 ```javascript
lond.mysql.event.on("error",function(err){
  console.error("发生错误"+err)
})
lond.mongodb.event.on("error",function(err){
  console.error("发生错误"+err)
})
lond.redis.event.on("error",function(err){
  console.error("发生错误"+err)
})
```



## API

## Mysql
 ```javascript
var options = {
    DATABASE: 'test', //数据库 默认值test库
    USERNAME: 'root', //用户名 默认值root
    PASSWORD: 'root', //密码   默认值root
    PORT: '3306',     //端口   默认值3306
    HOST: '127.0.0.1',//host   默认值localhost
    connectionLimit: 30,//连接池数量 默认值10
    multipleStatements: true
}
//项目加载时必须初始化mysql 后面得到 lond.mysql实例
lond.startMysql(options) //初始化Mysql模块 并得到mysql链接实例 lond会新增一个mysql key 作为mysql连接实例
```
### query(sql,data,callback) 同步执行
 ```javascript
  // 同步操作sql语句
 var user = await lond.mysql.query("select * from test");
  if (uer.error) {
        console.error("sql出错"+uer.error)
    }else{
    console.log(user)
    }
 ```
   
### Exquery(sql,data,callback) 异步执行
   ```javascript
//异步操作sql
  lond.mysql.Exquery("update set user = ?,age=?",["小黄人",20]);
 ```
 ## mongodb
 
 ```javascript
 var options ={
      host: 'mongodb://192.168.0.5:27017/node_club_test', // host:连接地址
      table:"node_club_test" // table:需要操作的库
      };
 lond.startMongoDB(options)//初始化mongodb模块 并得到mongodb链接实例 lond会新增一个mongd key 作为mongodb连接实例
  ```
  
###  find(table, data, skip, limit, sort) 同步查询
 * @param string dable:集合名 (必传)
 * @param objeck data :条件   (必传可为空对象)
 * @param number skip :从第几条开始查
 * @param number limit:查询多少条
 * @param object sort :排序
```javascript
//实例 查询 users集合 userName为小红 从第0条开始查询10条 以name字段倒序
 let user = await lond.mongod.find("users",{userName:"小红"},0,10,{name:-1} )
   if (uer.error) {
         console.error("sql出错"+uer.error)
    }else{
     console.log(user)
    }
 
  ```
  
### updateOne(table, data, value) 同步修改单条
 * @param string table 集合
 * @param object data  条件
 * @param object value  修改数据
 * @returns {Promise<any>}
 ```javascript
  let updateOne = await lond.mongod.updateOne(table, {}, {$set:{"test":"test"}}) 
    if (updateOne.error) {
         console.error("sql出错"+updateOne.error)
     }else{
     console.log(updateOne)
     }
  ```
    
### ExupdateOne(table, data, value) 异步修改单条
 * @param string table 集合
 * @param object data  条件
 * @param object value  修改数据
 * @returns {Promise<any>}
 ```javascript
    lond.mongod.updateOne(table, data, value) 
 ```
 
### updateAll(table, data, value, upsert) 同步修改满足条件的
 * @param string table 需要修改的集合
 * @param object data  条件
 * @param object value 需要修改的列和值
 * @param boolean upsert 有则修改没有则插入 默认false
  ```javascript
    let updateAll =  lond.mongod.updateAll(table, {}, {$set:{test:"111"}},true) 
       if (updateAll.error) {
         console.error("sql出错"+updateAll.error)
     }else{
     console.log(updateAll)
     }
 ```
 
### ExupdateAll (table, data, value) 异步修改满足条件的
 * @param string table 需要修改的集合
 * @param object data  条件
 * @param object value 需要修改的列和值
 ```javascript
      lond.mongod.ExupdateAll(table, {}, {$set:{test:"111"}}) 
  ```

### deleteOne (table, data) 同步删除单条
 * @param string table 需要修改的集合
 * @param object data  条件
  ```javascript
    let deleteOne =  lond.mongod.deleteOne(table, {}) 
       if (deleteOne.error) {
         console.error("sql出错"+deleteOne.error)
     }else{
     console.log(deleteOne)
     }
   ```

### ExdeleteOne (table, data)异步删除单条
  * @param string table 需要修改的集合
  * @param object data  条件
   ```javascript
      lond.mongod.ExdeleteOne(table, {}) 
  ```

### deleteAll(table, data)同步删除满足条件的
 * @param string table 需要修改的集合
 * @param object data  条件
 ```javascript
    let deleteAll =  lond.mongod.deleteAll(table, {}) 
       if (deleteAll.error) {
         console.error("sql出错"+deleteAll.error)
     }else{
     console.log(deleteAll)
     }
 ```
 ### ExdeleteAll (table, data)异步删除满足条件的
 * @param string table 需要修改的集合
 * @param object data  条件
```javascript
      lond.mongod.ExdeleteAll(table, {}) 
```
 
## redis
```javascript
  var options = { 
      verification: false,//是否开启redis密码连接
      port: 6379,
      host: '192.168.0.5',
      pwd: ''  //verification为true时需要填写密码
  };
  lond.startRedis(options)
  ```
### set(key, value, expire, pexpireat)同步set 
* @param string key
* @param string value
* @param number expire 过期时间 可以字符串
* @param boolean pexpireat 是否使用毫秒
* @returns {Promise<any>}
```javascript
 let set = await lond.redis.set('test','test')
 if (set.error) {
   console.error("sql出错"+set.error)
 }else{
   console.log(set)
 }
```
 
### Exset(key, value, expire, pexpireat)异步set 
* @param string  key
* @param string value
* @param number  expire
* @param boolean pexpireat
* @constructor

```javascript
lond.redis.Exset('test','test')
```
### get(key) 同步get
* @param string key
* @returns {Promise<any>}
```javascript
 let get = await lond.redis.get('test','test')
 if (get.error) {
   console.error("sql出错"+get.error)
 }else{
   console.log(get)
 }
```
 
### incr(key)同步递减 值必须是数字
 * @param string key
 * @returns {Promise<any>}
```javascript
 let incr = await lond.redis.incr('mun')
   if (incr.error) {
     console.error("sql出错"+incr.error)
   }else{
     console.log(incr)
   }
```
### Exincr(key)异步递减 值必须是数字
  * @param string key
  * @constructor
```javascript
    lond.redis.Exincr('num')
```
  
### rpush(key, value)同步从尾部push List
 * @param string key
 * @param value
```javascript
 let rpush = await lond.redis.rpush('test','test')
   if (rpush.error) {
     console.error("sql出错"+rpush.error)
   }else{
     console.log(rpush)
   }
```

### Exrpush(key, value)同步从尾部push List
 * @param string key
 * @param string value
```javascript
 lond.redis.Exrpush('test','test')
 
```

 
### lrem(key, num, flag)同步 删除list
 * @param string key
 * @param number num 删除个数
 * @param string flag 指定内容
 * @returns {Promise<any>}
 ```javascript
 let lrem = await lond.redis.lrem('test',1,"test")
   if (lrem.error) {
     console.error("sql出错"+lrem.error)
   }else{
     console.log(lrem)
   }
```
 
### list Exlrem (key, num, flag)异步删除
  * @param string  key
  * @param number num
  * @param string flag
  * @constructor
  
```javascript
lond.redis.Exlrem('test',1,"test")
```
  
### lrangen (key, startSum, stopSum)同步获取全部List
 * @param string  key
 * @param number startSum 开始位数
 * @param number stopSum  结束位数 -1为全部
 * @returns {Promise<any>}
 
 ```javascript
  let lrem = await lond.redis.lrangen('test',0,-1)
   if (lrangen.error) {
     console.error("sql出错"+lrangen.error)
   }else{
     console.log(lrangen)
   }
```

 
### hgetall(key)同步获取hash 
  * @param string  key
  * @returns {Promise<any>}
 ```javascript
  let hgetall = await lond.redis.hgetall('test')
   if (hgetall.error) {
     console.error("sql出错"+hgetall.error)
   }else{
     console.log(hgetall)
   }
```
  
### hget(hashkey, key)同步获取hash 
 *同步获取指定hash hget(hashkey, key)
 * @param string hashkey hash的key
 * @param string key     hash里面单跳key
 * @returns {Promise<any>}
 ```javascript
  let hget = await lond.redis.hget('hash',"haskkey")
   if (hget.error) {
     console.error("sql出错"+hget.error)
   }else{
     console.log(hget)
   }
```
 
 
### hset(hashkey, key, value)同步设置hash 
  * @param string hashkey
  * @param string key
  * @param string value
  * @returns {Promise<any>}
 ```javascript
  let hset = await lond.redis.hset('hahashkeysh',"key","test")
   if (hset.error) {
     console.error("sql出错"+hset.error)
   }else{
     console.log(hset)
   }
```
  
  
### Exhset(hashkey, key, value)同步设置hash
  * @param string hashkey
  * @param string key
  * @param string value
  * @returns {Promise<any>}
```javascript
  lond.redis.Exhset('hahashkeysh',"key","test")
```

### aes对称加解密
```javascript
lond.lond.start({{ // 设置aes加密参数
    key: '0123456789abcdef', //密钥
    iv: 'yunzhifundsproke', //偏移向量
    padding: 'PKCS7Padding' //补全值
}})

let en = lond.lond.encryption("aasdddd") //aes对称加密：
console.log(en) //Ugx9Wt6PWorg178MbA8+rg==
let de = lond.lond.encryption("Ugx9Wt6PWorg178MbA8+rg==") //aes对称解密
console.log(de) //aasdddd

```

### removeRepeatAttr(Array, key)删除json中重复内容

 * @param arr
 * @param string
 ```javascript
 var Array = [{"name":"111"},{"name":"111"},{"name":"222"}]
 var newArr = lond.lond.removeRepeatAttr(Array, "name")  //会删除一个name:111
   console.log(newArr) // [{"name":"111"},{"name":"222"}]
     
```

### numberCheck(num,pStatus)检查是否为数字
    *@param number
    *@param bumber 两个参数 1：数字  2:true为小数 fale不是小数
    *@return boolena
```javascript
console.log(lond.lond.numberCheck(100,false))//true
```

### checkEmail(str)验证邮箱
   * @param str
   * @returns {boolean}
```javascript
console.log(lond.lond.checkEmail("123@qq.com"))//true
```
### uuid()获取uuid
    * @returns string
```javascript
console.log(lond.lond.uuid())//d115yu5a61wd6wa1u6aw1d61adwa5
```
### repArr(arr)数组去重
    * @param arr
    * @returns {arr}
```javascript
console.log(lond.lond.repArr(['aa','aa','bb']))//['aa','bb']
```
###  trim(num)去除空白
   * @param string
   * @returns string
```javascript
console.log(lond.lond.trim('a s dd'))//asdd
```
###  checkRealNum(num)检查是否为实数
   * @param number num
```javascript
console.log(lond.lond.checkRealNum(asd))//asdd
```

### daysBetween(DateOne,DateTwo)计算两日期之间的相差天数
  * @param string
  * @param string
  * @returns number
```javascript
console.log(lond.lond.daysBetween("2018-05-12","2018-05-13"))//1
```
### getRandomArrayElements(arr, count)数组中指定取出字符中参数

  * @param array arr
  * @param obj
  * @returns obj
```javascript
console.log(lond.lond.getRandomArrayElements(['aa','bb'], 'aa'))//aa
```

### componentDate(arr)將一個二维数组转为一维数组
  * @param array arr
  * @returns array arr
  ```javascript
console.log(lond.lond.getRandomArrayElements(['aa','bb'], 'aa'))//aa
```
  
### instend(arrOne,arrtow)得到两个数组中不同部分
  * @param array arrOne
  * @param array arrtow
  * @returns arr
```javascript
console.log(lond.lond.instend(['aa','bb'], ['aa','bb','cc']))//cc
```
  
### contains(arr, obj)判断数组中是否包含元素
  * @param array arr
  * @param obj obj
  * @returns boolean
```javascript
console.log(lond.lond.instend(['aa','cc'], ['cc']))//true
```
### formatDateTime(num)获取时间
   * @param number 1: yyyy-MM-dd hh:mm:ss,2: yyyy-mm-dd,3: hh:mm:ss,4: 毫秒时间戳
  * @returns {string}
  
 ```javascript
console.log(lond.lond.formatDateTime(2))//2019-04-25
```

### randomWord(min,max)随机生成字符串
      * @param min//最少多少位
      * @param max//最多多少位
      * @returns {string}
 ```javascript
console.log(lond.lond.randomWord(2,2))//ax
```


### remove(array,val)删除数组中指定值并且不留下
     * @param array
     * @param obj

```javascript
console.log(lond.lond.remove(['aa','bb'],'aa'))//['bb']
```


### remove(array,val)删除数组中指定值并且不留下
     * @param array
     * @param obj

```javascript
console.log(lond.lond.remove(['aa','bb'],'aa'))//['bb']
```


### compressToEncodedURIComponent(obj) 数据压缩
     * @param obj
```javascript
var reqData = "123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
console.log("压缩",lond.zpi.compressToEncodedURIComponent(reqData)) //IwJgzAhl07fwx0g
```

### decompressFromEncodedURIComponent(str) 数据解压
     * @param obj str
```javascript
var reqData = "IwJgzAhl07fwx0g"
console.log("压缩",lond.zpi.decompressFromEncodedURIComponent(reqData)) //123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

