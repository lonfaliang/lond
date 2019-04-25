# lond

## 简介：

1、lond 集成了mysql mongodb redis 加密 的操作 </br>

2、基于模块 crypto mysql mongodb redis</br>

3、参数返回格式 会返回error参数 如果error不为null就说明sql出错 {error:null,result:true}</br>

4、每个模块都会有start、ready、error事件</br>

5、初始化模块会触发start事件 初始化完成会触发ready事件 报错会触发error事件</br>

6、可以根据项目需要初始化不通模块即可

 ### 1、安装部署
 
1、运行 npm install lond 直接将lond包安装包到项目</br>

2、引入
```javascript 
 var lond = require('lond')
 ```
 ###2、初始化mysql
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
 
  ### 3、初始化mongodb
  
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
 

   
   
 
 
 
