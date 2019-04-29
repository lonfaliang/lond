var crypto = require('crypto')
var UUID = require('uuid');


/**
 * AES加密的配置
 * 1.密钥
 * 2.偏移向量
 * 3.算法模式CBC
 * 4.补全值
 */
var AES_conf = {}

var router = {
    /*初始化加密*/
    start: (data) => {
        if (typeof data == "object") {
            AES_conf.key = data.key || "0123456789abcdef"
            AES_conf.iv = data.iv || "0123456789abcdef"
            AES_conf.padding = data.padding || "PKCS7Padding"
        } else {
            AES_conf.key = "0123456789abcdef"
            AES_conf.iv = "0123456789abcdef"
            AES_conf.padding = "PKCS7Padding"
        }
    },

    /**encryption(object)
     * data.key ：16位钥匙 任意字符串
     * data.iv : 16位偏移量 任意字符串
     * data.value: 需要加密内容
     * AES_128_CBC 加密
     * 128位
     * return base64
     *
     */
    encryption: (data) => {
        let key = AES_conf.key || data.key;
        let iv = AES_conf.iv || data.iv;
        // let padding = AES_conf.padding;
        var cipherChunks = [];
        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        cipher.setAutoPadding(true);
        cipherChunks.push(cipher.update(data.value, 'utf8', 'base64'));
        cipherChunks.push(cipher.final('base64'));
        return cipherChunks.join('');
    },

    /** decryption(object)
     *  data.key ：16位钥匙 任意字符串
     * data.iv : 16位偏移量 任意字符串
     * data.value: 需要解密密内容
     * 解密
     * return utf8
     */
    decryption: (data) => {
        let key = AES_conf.key || data.key;
        let iv = AES_conf.iv || data.iv;
        // let padding = AES_conf.padding;
        var cipherChunks = [];
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data.value, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    },

    /**删除json中重复内容
     * removeRepeatAttr(Array, key)
     *实例
     * var arr = [{name:"test"},{name:"test"},name:"hell"]
     *var key = name
     * removeRepeatAttr(arr, key)
     * @param Array
     * @param key
     */
    removeRepeatAttr: (Array, key) => {
        var tmp = {}, b = [], a = Array;
        for (var i = 0; i < a.length; i++) {
            if (!tmp[a[i][key]]) {
                tmp[a[i][key]] = !0;
            } else {
                a.splice(i, 1);
            }
        }
        ;
    },

    /* numberCheck(num,pStatus)
   *检查是否为数字
   * 两个参数 1：数字  2:true为小数 fale不是小数
   */
    numberCheck: (num, pStatus) => {
        var tValue = num;
        var tFoamt = "";
        if (pStatus) {
            tFoamt = /^\d+(\.\d+)?$/.test(tValue);
        }
        else {
            tFoamt = /^[0-9]*$/g.test(tValue);
        }
        if (tValue != "") {
            if (tFoamt) {//輸入格式符合
                return true;
            }
            else {//輸入格式不符
                return false;
            }
        }
    },

    /**checkEmail(str)
     * 验证邮箱
     * @param str
     * @returns {boolean}
     */
    checkEmail: (str) => {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if (re.test(str)) {
            return true
        } else {
            return false
        }
    },

    /**uuid()
     * 获取uuid
     */
    uuid: () => { //获取uuid
        var ID = UUID.v1().replace(/\-/g, '');
        return ID;
    },

    /**repArr(arr)
     * 数组去重
     * @param arr
     * @returns {*}
     */
    repArr: (arr) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr.indexOf(arr[i]) != i) {
                arr.splice(i, 1);//删除数组元素后数组长度减1后面的元素前移
                i--;//数组下标回退
            }
        }
        return arr;
    },

    /* trim(pValue);
    *去除空白
    * 只能有一个参数
    */
    trim: (pValue) => {
        return pValue.replace(/^[\s]*/gi, "").replace(/[\s]*$/gi, "");
    },

    /* checkRealNum(pStatus)
    *检查是否为实数
    * 参数：任何参数
    */
    checkRealNum: (obj) => {
        var re = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/;
        if (!re.test(obj.value)) {
            obj.value = "";
            return false;
        }
        else {
            return true;
        }
    },

    /*daysBetween(DateOne,DateTwo)
    *计算两日期之间的相差天数
    *日期格式 yyyy-mm-dd
    *两个参数
    */
    daysBetween: (DateOne, DateTwo) => {
        var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
        var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
        var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

        var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
        var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
        var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

        var cha = ((Date.parse(OneMonth + '-' + OneDay + '-' + OneYear) - Date.parse(TwoMonth + '-' + TwoDay + '-' + TwoYear)) / 86400000) + 1;
        return Math.abs(cha);

    },

    // /*getRandomArrayElements(arr, count)
    // *指定取出字符中参数
    // *两个参数1：Array  2 数字参数(不能超过array的length)
    // *
    // */
    // getRandomArrayElements: (arr, count) => {
    //     var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    //     while (i-- > min) {
    //         index = Math.floor((i + 1) * Math.random());
    //         temp = shuffled[index];
    //         shuffled[index] = shuffled[i];
    //         shuffled[i] = temp;
    //     }
    //     return shuffled.slice(min);
    // },

    /**componentDate(data)
     * 將一個二维数组转为一维数组
     * 参数 ：二维数组
     */
    componentDate: (data) => {
        data = data.split(';');
        var info = [];
        for (var i = 0; i < data.length; i++) {
            info[i] = data[i].split(",");
        }
        return info;
    },

    /**instend(one,tow)
     * 得到两个数组中不同部分
     * 参数 ：两个数组
     */

    instend: (one, tow) => {
        var a = one;
        var b = tow;
        var c = [];
        var tmp = a.concat(b);
        var o = {};
        for (var i = 0; i < tmp.length; i++) (tmp[i] in o) ? o[tmp[i]]++ : o[tmp[i]] = 1;
        for (x in o) if (o[x] == 1) c.push(x);
        return c;
    },

    /* contains(arr, obj) ;
    *判断数组中是否包含元素
    *
    */
    contains: (arr, obj) => {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },

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
    formatDateTime: (obj) => {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        if (obj == 1) {
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        }
        if (obj == 2) {
            return y + '-' + m + '-' + d;
        }
        if (obj == 3) {
            return h + ':' + minute + ':' + second;
        }
        if (obj == 4) {
            return date.getTime();
        }
    },

    /**
     * 生成字符串
     * @param min//最少多少位
     * @param max//最多多少位
     * @returns {string}
     */
    randomWord: (min, max) => {
        var str = "",
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        range = Math.round(Math.random() * (max - min)) + min;
        for (var i = 0; i < range; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    },
    /**
     * 删除数组中指定的值
     * @param array
     * @param val
     * @returns {*}
     */
    remove: function (array, val) {
        var index = array.indexOf(val);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array
    }


}


module.exports = router