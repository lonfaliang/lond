 # 简介：
1、lond 集成了mysql mongodb redis 加密 的操作 </br>

2、基于模块 crypto mysql mongodb redis</br>

3、参数返回格式 会返回error参数 如果error不为null就说明sql出错 {error:null,result:true}</br>

4、每个模块都会有start、ready、error事件</br>

5、初始化模块会触发start事件 初始化完成会触发ready事件 报错会触发error事件</br>

6、可以根据需要增加加载模块


## 一 、安装部署
 1、运行 npm install lond 直接将lond包安装包到项目

 2、引入
 ```javascript
  var lond = require('lond')
```
## 二、初始化
### 1、初始化mysql
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
### 2、初始化mongodb
 ```javascript
 var options = {
         host: 'mongodb://127.0.0.1:27017/node_club_test',
         table: "node_club_test"
    };
 lond.startMongoDB(options)
```
### 3、初始化redis
 ```javascript
 var options = {
     port: 6379,
     host: '192.168.0.5',
 };
 lond.startRedis(options)
```
## 三、监听事件
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



## 四、 API

### 1、Mysql
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
  ### 3、mongodb
 
 ```javascript
 var options ={
      host: 'mongodb://192.168.0.5:27017/node_club_test', // host:连接地址
      table:"node_club_test" // table:需要操作的库
      };
 lond.startMongoDB(true, options)//初始化mongodb模块 并得到mongodb链接实例 lond会新增一个mongd key 作为mongodb连接实例
  ```
  
###  find(table, data, skip, limit, sort) 同步查询
 ```javascript
 // dable:集合名 (必传)
// data :条件   (必传)
// skip :从第几条开始查
// limit:查询多少条
// sort :排序
//find:除了第一个参数为必填其他参数均为可选

//实例 查询 users集合 userName为小红 从第0条开始查询10条 以name字段倒序
 let user = await lond.mongod.find("users",{userName:"小红"},0,10,{name:-1} )
   if (uer.error) {
         console.error("sql出错"+uer.error)
     }else{
     console.log(user)
     }
 
   ```
  
### updateOne(table, data, value) 同步修改单条
 * @param table 集合
 * @param data  条件
 * @param value  修改数据
 * @returns {Promise<any>}
 ```javascript
  let updateOne = await lond.mongod.updateOne(table, data, value) 
    if (updateOne.error) {
         console.error("sql出错"+updateOne.error)
     }else{
     console.log(updateOne)
     }
  ```
    
### ExupdateOne(table, data, value) 异步修改单条
 * @param table 集合
 * @param data  条件
 * @param value  修改数据
 * @returns {Promise<any>}
 ```javascript
    lond.mongod.updateOne(table, data, value) 
 ```
 
  5、
 /**同步修改满足条件的updateAll(table, data, value, upsert)
 * @param table 需要修改的集合
 * @param data  条件
 * @param value 需要修改的列和值
 * @param upsert 有则修改没有则插入 默认false
 */
 

6、
/**异步修改满足条件的ExupdateAll (table, data, value)
 * @param table 需要修改的集合
 * @param data  条件
 * @param value 需要修改的列和值
 */

7、
/**同步删除单条 deleteOne (table, data)
 * @param table 需要修改的集合
 * @param data  条件
 */
 
 8、
 /**异步删除单条ExdeleteOne (table, data)
  * @param table 需要修改的集合
  * @param data  条件
  */
  
 9、
/**同步删除满足条件的deleteAll(table, data)
 * @param table 需要修改的集合
 * @param data  条件
 */
 
 10、
/**异步删除满足条件的ExdeleteAll (table, data)
 * @param table 需要修改的集合
 * @param data  条件
 */
 
 
六 、redis
 
 
 1、初始化redi
  var re = {
      verification: false,//是否开启redis密码连接
      port: 6379,
      host: '192.168.0.5',
     pwd: 'test'
  };
  lond.startRedis(true, re)
  

 2、
/**
*同步set set(key, value, expire, pexpireat)
* @param key
* @param value
* @param expire 过期时间 可以字符串
* @param pexpireat 是否使用毫秒
* @returns {Promise<any>}
*/
 
 
3、
/***
* 异步set Exset(key, value, expire, pexpireat)
* @param key
* @param value
* @param expire
* @param pexpireat
* @constructor
*/
  
4、
/**
*同步get get(key)
* @param key
* @returns {Promise<any>}
*/
   
5、

/**
 * 同步递减 值必须是数字 incr(key)
 * @param key
 * @returns {Promise<any>}
 */
 
 6、
 /***
  * 异步递减 值必须是数字 Exincr(key)
  * @param key
  * @constructor
  */
  
 7、
 /**
 * 从尾部push List
 * @param key
 * @param value
 */
   
   8、
/**
 * 异步新增list
 * @param key
 * @param value
 * @returns {Promise<any>}
 * @constructor
 */
 
9、

/**
 * 同步 删除list lrem(key, num, flag)
 * @param key
 * @param num 删除个数
 * @param flag 指定内容
 * @returns {Promise<any>}
 */
 
 10、
 /**
  * 异步删除list Exlrem (key, num, flag)
  * @param key
  * @param num
  * @param flag
  * @constructor
  */
  
  11、
 
/**
 *同步获取全部List lrangen (key, startSum, stopSum)
 * @param key
 * @param startSum 开始位数
 * @param stopSum  结束位数 -1为全部
 * @returns {Promise<any>}
 */
 
 12、
 /**
  * 同步获取hash  hgetall(key)
  * @param key
  * @returns {Promise<any>}
  */
  
  
13、
/**
 *同步获取指定hash hget(hashkey, key)
 * @param hashkey hash的key
 * @param key     hash里面单跳key
 * @returns {Promise<any>}
 */
 
 
 14、
 /**
  * 同步设置hash  hset(hashkey, key, value)
  * @param hashkey
  * @param key
  * @param value
  * @returns {Promise<any>}
  */
  
  15、
  /**
   * 异步设置hash Exhset(hashkey, key, value)
   * @param hashkey
   * @param key
   * @param value
   * @constructor
   */

七、其他封装方法


    lond.lond.encryption("asdasdsd")

    1、aes对称加密：encryption(str)
    /**encryption(object)
     * data.key ：16位钥匙 任意字符串
     * data.iv : 16位偏移量 任意字符串
     * data.value: 需要加密内容
     * AES_128_CBC 加密
     * 128位
     * return base64
     */

     2、aes对称解密：decryption(str)
    /** decryption(object)
     *  data.key ：16位钥匙 任意字符串
     * data.iv : 16位偏移量 任意字符串
     * data.value: 需要解密密内容
     * 解密
     * return utf8
     */

     3、 removeRepeatAttr(Array, key)
     var Array = [{"name":"111"},{"name":"111"},{"name":"222"}]
     removeRepeatAttr(Array, "name") //会删除一个name:111
      /**删除json中重复内容
      * removeRepeatAttr(Array, key)
      *实例
      * var arr = [{name:"test"},{name:"test"},name:"hell"]
      *var key = name
      * removeRepeatAttr(arr, key)
      * @param Array
      * @param key
      */

      4、 /* numberCheck(num,pStatus)
         *检查是否为数字
         * 两个参数 1：数字  2:true为小数 fale不是小数
         */

       5、/**checkEmail(str)
        * 验证邮箱
        * @param str
        * @returns {boolean}
        */

      6、/**uuid()
       * 获取uuid
       */

       7、/**repArr(arr)
       * 数组去重
       * @param arr
       * @returns {*}
       */

     8、
      /* trim(pValue);
       *去除空白
       * 只能有一个参数
       */

      9、
      /* checkRealNum(pId,pStatus)
       *检查是否为实数
       * 参数：任何参数
       */

    10、
      /*daysBetween(DateOne,DateTwo)
       *计算两日期之间的相差天数
       *日期格式 yyyy-mm-dd
       *两个参数
       */

     11、
      /*getRandomArrayElements(arr, count)
       *指定取出字符中参数
       *两个参数1：Array  2 数字参数(不能超过array的length)
       *
       */

    12、
      /**componentDate(data)
       * 將一個二维数组转为一维数组
       * 参数 ：二维数组
       */
   13、
      /**instend(one,tow)
       * 得到两个数组中不同部分
       * 参数 ：两个数组
       */

    14、
     /* contains(arr, obj) ;
      *判断数组中是否包含元素
      *
      */

    15、
     /**
      *获取时间
      * 参数
      * 1: yyyy-MM-dd hh:mm:ss
      * 2: yyyy-mm-dd
      * 3: hh:mm:ss
      * 4: 毫秒时间戳
      * @param obj
      *
      * @returns {*}
      */
     16、
    /**
      * 生成字符串
      * @param min//最少多少位
      * @param max//最多多少位
      * @returns {string}
      */
