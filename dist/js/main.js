'use strict';
// document.write("<script src='http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js'></script>");

(function (window) {
  var theUA = window.navigator.userAgent.toLowerCase();
  if (theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0] || theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0]) {
    var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
    if (ieVersion < 8) {
      var str = "您的浏览器版本太low了,已经和时代脱轨了 :(";
      var str2 = "推荐使用:<a href='https://www.baidu.com/s?ie=UTF-8&wd=%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank' style='color:red;'>谷歌</a>," + "<a href='https://www.baidu.com/s?ie=UTF-8&wd=%E7%81%AB%E7%8B%90%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank' style='color:red;'>火狐</a>," + "或其他双核浏览器";
      document.writeln("<pre style='text-align:center;color:#fff;background-color:#333; height:100%;border:0;position:fixed;top:0;left:0;width:100%;z-index:1234;margin:0;'>" + "<h2 style='padding-top:200px;margin:0;'><strong style='color:#fff;'>" + str + "<br/></strong></h2><h2>" + str2 + "</h2><h2 style='margin:0'><strong style='color:#fff;'>如果您使用的是双核浏览器,请切换到极速模式访问<br/></strong></h2></pre>");
      document.execCommand("Stop");
    };
  }
})(window);

/*
TUDO
配置API url
测试地址：http://mmc-test.huatu.com
Beta地址: http://yk91.test.huatu.com
正式地址：http://mmc.ekao123.com
*/

var apiUrl = 'http://mmc-test.huatu.com/'; //接口地址
var signKey = 'CMD3qB0kwOsrTJpASv+8YhhSA58yzissr4r2Ouf2rCk'; //签名key
var subjectid = '2300';
var urlConfig = {
  getcode: {
    url: apiUrl + 'api/tiku/political/getcode',
    method: 'post'
  },
  codelogin: {
    url: apiUrl + '/api/tiku/political/codelogin',
    method: 'post'
  },
  getxueke: {
    url: apiUrl + 'api/tiku/political/getxueke',
    method: 'post'
  },
  getquestionlist: {
    url: apiUrl + 'api/tiku/political/getquestionlist',
    method: 'post'
  },
  getquestiondetail: {
    url: apiUrl + 'api/tiku/political/getquestiondetail',
    method: 'post'
  },
  submitanswer: {
    url: apiUrl + 'api/tiku/political/submitanswer',
    method: 'post'
  },
  getrecordlist: {
    url: apiUrl + 'api/tiku/political/getrecordlist',
    method: 'post'
  },
  getrecorddetail: {
    url: apiUrl + 'api/tiku/political/getrecorddetail',
    method: 'post'
  },
  verify: {
    url: apiUrl + 'admin/verify?key=policical',
    method: 'get'
  }
};
var globalcrrentListType; //试题类型

var header = "\n<h1 class=\"logo\">\n  <a href=\"index.html\" title=\"\u534E\u56FE\u653F\u6CD5\">\u534E\u56FE\u653F\u6CD5</a>\n  <em class=\"line\"></em>\n  <span>\u4E66\u8BB0\u5458\u901F\u5F55\u7CFB\u7EDF</span>\n</h1>\n<div class=\"fr\" id=\"hlogin\">\n  <!-- \u9876\u90E8\u5BFC\u822A -->\n  <a class=\"h-nav\" :class=\"{'on':ifkd}\" href=\"list-kd.html\" title=\"\u770B\u6253\u7EC3\u4E60\">\u770B\u6253\u7EC3\u4E60</a>\n  <a class=\"h-nav\" :class=\"{'on':iftd}\" href=\"list-td.html\" title=\"\u542C\u6253\u7EC3\u4E60\">\u542C\u6253\u7EC3\u4E60</a>\n  <!-- \u5DF2\u767B\u5F55 -->\n  <div class=\"if-login\" v-if=\"iflogin\">\n    <span class=\"header-uid\">{{ phone_hide }}</span>\n    <div class=\"header-uchosse\">\n      <a href=\"record.html\" title=\"\u7EC3\u4E60\u8BB0\u5F55\">\u7EC3\u4E60\u8BB0\u5F55</a>\n      <span title=\"\u70B9\u51FB\u9000\u51FA\" v-on:click=\"logout\">\u9000\u51FA</span>\n    </div>\n  </div>\n  <!-- \u672A\u767B\u5F55 -->\n  <span class=\"else-login\" v-else v-on:click=\"showLoingPop()\"><i class=\"icon01\"></i>\u5FEB\u901F\u767B\u5F55</span>\n</div>\n";

var footer = "\n<p class=\"width footnav\">\n  <a href=\"#\" title=\"\">\u534E\u56FE\u7B80\u4ECB</a>\n  <a href=\"#\" title=\"\">\u534E\u56FE\u8363\u8A89</a>\n  <a href=\"#\" title=\"\">\u534E\u56FE\u516C\u76CA</a>\n  <a href=\"#\" title=\"\">\u5A92\u4F53\u5173\u6CE8</a>\n  <a href=\"#\" title=\"\">\u8054\u7CFB\u6211\u4EEC</a>\n  <a href=\"#\" title=\"\">\u6CD5\u5F8B\u58F0\u660E</a>\n  <a href=\"#\" title=\"\">\u8D1F\u8D23\u58F0\u660E</a>\n  <a href=\"#\" title=\"\">\u7F51\u7AD9\u5BFC\u822A</a>\n  <a href=\"#\" title=\"\">\u6295\u8BC9\u4E0E\u5EFA\u8BAE</a>\n  <a href=\"#\" title=\"\">\u7533\u8BF7\u53CB\u94FE</a>\n  <a href=\"#\" title=\"\">\u52A0\u5165\u6211\u4EEC</a>\n</p>\n<p>\u4EACICP\u5907 11028696\u53F7 \u4EACICP\u8BC1090387\u53F7 \u4EAC\u516C\u7F51\u5B89\u5907 11010802010141 \u7535\u4FE1\u4E1A\u52A1\u5BA1\u6279\u30102009\u3011\u5B57\u7B2C233\u53F7\u51FD</p>\n";

var popLayer = "\n<div class=\"pop-box pop-login\" id=\"popLogin\">\n  <span class=\"pop-close\" @click=\"closePop\"></span>\n  <h3 class=\"pop-tit\">\u767B\u5F55</h3>\n  <div class=\"login-tips\"></div>\n  <form id=\"loginForm\">\n    <div class=\"clearfix in-box\">\n      <input type=\"text\" class=\"in-text\" v-model=\"phone\" name=\"phone\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u624B\u673A\u53F7\" autocomplete=\"off\">\n      <p class=\"war\" v-show=\"phoneMessage\">{{phoneMessage}}</p>\n    </div>\n    <div class=\"clearfix in-box verify-box\" id=\"verifyBox\" v-if=\"showVerify\">\n      <input type=\"text\" class=\"in-text\" v-model=\"verify\" name=\"verify\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801\" autocomplete=\"off\">\n      <img class=\"verify-img\" :src=\"verifyUrl\" onClick=\"this.src= urlConfig.verify.url + '&' + Math.random(); \" alt=\"\u56FE\u5F62\u9A8C\u8BC1\u7801\" title=\"\u70B9\u51FB\u66F4\u6362\u9A8C\u8BC1\u7801\">\n      <p class=\"war\" v-show=\"verifyMessage\">{{verifyMessage}}</p>\n    </div>\n    <div class=\"clearfix in-box\">\n      <input type=\"text\" class=\"in-text\" v-model=\"code\" name=\"code\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u77ED\u4FE1\u9A8C\u8BC1\u7801\" autocomplete=\"off\">\n      <input type=\"button\" class=\"codebtn\" v-bind:class=\"codebtnoff\" v-bind:disabled=\"disabled\" v-on:click=\"sendCode\" :value=\"sendCodeBtn\" >\n      <p class=\"tip\" v-show=\"loginMessage\">{{loginMessage}}</p>\n      <p class=\"war\" v-show=\"codeMessage\">{{codeMessage}}</p>\n    </div>\n    <input type=\"button\" class=\"loginbtn\" @click=\"login()\" value=\"\u5FEB\u901F\u767B\u5F55\">\n  </form>\n</div>\n";

Vue.prototype.infomation = new Vue();

//顶部
new Vue({
  el: '#header',
  data: {
    header: header
  },
  created: function created() {}
});

//登录
new Vue({
  el: '#hlogin',
  data: {
    ifkd: false,
    iftd: false,
    iflogin: false,
    phone_hide: ''
  },
  created: function created() {

    if (globalcrrentListType == '160') {
      this.ifkd = true;
    }
    if (globalcrrentListType == '161') {
      this.iftd = true;
    }

    var self = this;

    this.phone_hide = getCookie('phone_hide');
    // if (this.phone_hide == null && getCookie('phone') && getCookie('token') && getCookie('userid')){
    //   this.iflogin = true;
    // } 
    console.log(this.phone_hide);
    if (this.phone_hide) this.iflogin = true;
    console.log(this.phone_hide);

    this.infomation.$on('modifyIfLogin', function (data) {
      self.iflogin = data;
      self.phone_hide = getCookie('phone_hide');
    });
  },
  methods: {
    showLoingPop: function showLoingPop(event) {
      $('#popLayer').show();
    },
    logout: function logout() {
      delCookie('token');
      delCookie('userid');
      delCookie('phone');
      delCookie('phone_hide');
      // setCookie('token', "", -1);
      // setCookie('userid', "", -1);
      // setCookie('phone', "", -1);
      // setCookie('phone_hide', "", -1);
      this.iflogin = false;
      // console.log(this.iflogin)
    }
  }
});

//底部
new Vue({
  el: '#footer',
  data: {
    footer: footer
  }
});

Vue.component('pop-layer', {
  data: function data() {
    return {
      verifyUrl: urlConfig.verify.url,
      showVerify: false,
      phone: null,
      code: null,
      verify: null,
      codeError: 0,
      phoneMessage: null,
      verifyMessage: null,
      sendCodeBtn: '立即发送',
      codeMessage: null,
      loginMessage: '新用户登录后将自动创建账号',
      disabled: false,
      sysSecond: 60,
      interValObj: null,
      codebtnoff: {
        codebtnoff: false
      }
    };
  },
  methods: {
    setRemainTime: function setRemainTime() {
      if (this.sysSecond > 0) {
        this.sysSecond = this.sysSecond - 1;
        var second = Math.floor(this.sysSecond % 60);
        var minite = Math.floor(this.sysSecond / 60 % 60);
        var hour = Math.floor(this.sysSecond / 3600 % 24);
        this.sendCodeBtn = second + '秒';
      } else {
        window.clearInterval(this.interValObj);
        this.sendCodeBtn = '立即发送';
        this.codebtnoff.codebtnoff = false;
        this.disabled = false;
        this.sysSecond = 60;
      }
    },
    sendCode: function sendCode() {
      var that = this;
      if (!this.phone) {
        this.phoneMessage = '请输入手机号';
        return false;
      } else {
        if (!/^(1[0-9]{10})$/.test(this.phone)) {
          this.phoneMessage = '请输入有效的手机号码！';
          return false;
        } else {
          this.phoneMessage = null;
        }
      }
      var sendData = {
        'phone': this.phone,
        'timestamp': Date.parse(new Date()) / 1000
      };

      sendData.sign = getSign(sendData);

      $.ajax({
        url: urlConfig.getcode.url,
        method: urlConfig.getcode.method,
        data: sendData,
        dataType: 'json',
        async: false,
        success: function success(res) {
          var code = res.code;
          var data = res.data;
          if (code != '200') {
            this.phoneMessage = res.msg;
            return false;
          }

          // 短信验证码发送成功
          that.phoneMessage = null;
          that.codebtnoff.codebtnoff = true;
          that.disabled = true;

          that.interValObj = window.setInterval(function () {
            that.setRemainTime();
          }, 1000);
        }
      });
    },
    login: function login() {

      if (!this.phone) {
        this.phoneMessage = '请输入手机号';
        return false;
      } else {
        if (!/^(1[0-9]{10})$/.test(this.phone)) {
          this.phoneMessage = '请输入有效的手机号码！';
          return false;
        } else {
          this.phoneMessage = null;
        }
      }

      if (!this.code) {
        this.codeMessage = '请输入短信验证码';
        this.loginMessage = null;
        return false;
      } else {
        this.codeMessage = null;
        this.loginMessage = '新用户登录后将自动创建账号';
      }
      if (this.showVerify && !this.verify) {
        this.verifyMessage = '请输入图片验证码';
        return false;
      } else {
        this.verifyMessage = null;
      }
      var sendData = {
        'phone': this.phone,
        'timestamp': Date.parse(new Date()) / 1000,
        'code': this.code
      };

      if (this.showVerify) {
        sendData.verify = this.verify;
      }

      sendData.sign = getSign(sendData);

      var that = this;
      $.ajax({
        url: urlConfig.codelogin.url,
        method: urlConfig.codelogin.method,
        data: sendData,
        dataType: 'json',
        success: function success(res) {

          var resCode = res.code;
          var resData = res.data;

          if (resCode != '200') {
            if (resCode == '100003') {
              that.verifyMessage = res.msg; //图形验证码错误
            } else if (resCode == '100004') {
              that.codeMessage = res.msg; //短信验证码错误
              that.loginMessage = null;
              that.codeError++;
              //短信验证码连续输入错误3次则必须输入图形验证码
              if (that.codeError >= 3) {
                that.showVerify = true;
              }
            } else {
              that.codeMessage = res.msg;
              that.loginMessage = null;
            }

            return false;
          }

          mySetCookie('token', resData.token);
          mySetCookie('userid', resData.userid);
          mySetCookie('phone', resData.phone);
          mySetCookie('phone_hide', resData.phone_hide);

          that.infomation.$emit('modifyIfLogin', true);
          $('#popLayer').hide();

          that.phoneMessage = null;
          that.verifyMessage = null;
          that.codeMessage = null;
          that.loginMessage = '新用户登录后将自动创建账号';

          return false;
        }
      });
    },
    closePop: function closePop(event) {
      $('#popLayer, #popReport').hide();
      $('.login-tips').hide(); // 隐藏登录后才可查看报告
    }
  },
  template: popLayer
});

//弹窗
new Vue({
  el: '#popLayer',
  data: {},
  methods: {}
});

function getSign(params) {
  var res = Object.keys(params).sort();
  var str = '';
  for (var key in res) {
    str += res[key] + '=' + params[res[key]] + '&';
  }
  str += 'key=' + signKey;
  return md5(str).toUpperCase();
}

function mySetCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name) {
  var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

//删除cookies
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1111);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
  }
  // $.cookie(name, "", {expires: -1})
  // $.cookie(name,null,{path:"/"});
  // $.removeCookie(name,{ path: '/'}); //path为指定路径，直接删除该路径下的cookie
  // $.cookie(name,null,{ path: '/'}); //将cookie名为‘openid’的值设置为空，实际已删除
}

//判断登录
function checkLogin() {

  if (!getCookie('token') || !getCookie('userid') || !getCookie('phone') || !getCookie('phone_hide')) {
    return false;
  }
  return true;
}

//获取参数
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

//获取学科
function getxuekelist(type) {
  var returnArr = [];

  var sendData = {
    subjectid: subjectid,
    datatype: type,
    timestamp: Date.parse(new Date()) / 1000
  };
  sendData.sign = getSign(sendData);

  //请求成功
  $.ajax({
    url: urlConfig.getxueke.url,
    method: urlConfig.getxueke.method,
    async: false,
    data: sendData,
    dataType: 'json',
    success: function success(res) {
      if (type == '1') {
        returnArr = res.data.xueke;
      } else if (type == '2') {
        returnArr = res.data.questiontype;
      } else if (type == '3') {
        returnArr = res.data.speed;
      } else {
        returnArr = res.data;
      }
    }
  });
  return returnArr;
}
