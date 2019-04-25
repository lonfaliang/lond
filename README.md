# lond

# # 简介：

1、lond 集成了mysql mongodb redis 加密 的操作 </br>

2、基于模块 crypto mysql mongodb redis</br>

3、参数返回格式 会返回error参数 如果error不为null就说明sql出错 {error:null,result:true}</br>

4、每个模块都会有start、ready、error事件</br>

5、初始化模块会触发start事件 初始化完成会触发ready事件 报错会触发error事件</br>

 # # 1、安装部署
 
1、运行 npm install lond 直接将lond包安装包到项目</br>

2、引入
```javascript 
 var lond = require('lond')</br>
