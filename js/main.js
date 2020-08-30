'use strict';
// document.write("<script src='http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js'></script>");
(function(window) {
  var theUA = window.navigator.userAgent.toLowerCase();
  if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) || (theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0])) {
    var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
    if (ieVersion < 8) {
      var str = "您的浏览器版本太low了,已经和时代脱轨了 :(";
      var str2 = "推荐使用:<a href='https://www.baidu.com/s?ie=UTF-8&wd=%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank' style='color:red;'>谷歌</a>," +
        "<a href='https://www.baidu.com/s?ie=UTF-8&wd=%E7%81%AB%E7%8B%90%E6%B5%8F%E8%A7%88%E5%99%A8' target='_blank' style='color:red;'>火狐</a>," +
        "或其他双核浏览器";
      document.writeln("<pre style='text-align:center;color:#fff;background-color:#333; height:100%;border:0;position:fixed;top:0;left:0;width:100%;z-index:1234;margin:0;'>" +
        "<h2 style='padding-top:200px;margin:0;'><strong style='color:#fff;'>" + str + "<br/></strong></h2><h2>" +
        str2 + "</h2><h2 style='margin:0'><strong style='color:#fff;'>如果您使用的是双核浏览器,请切换到极速模式访问<br/></strong></h2></pre>");
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
  getrecordlist:{
    url: apiUrl + 'api/tiku/political/getrecordlist',
    method: 'post'
  },
  getrecorddetail:{
    url:apiUrl + 'api/tiku/political/getrecorddetail',
    method: 'post'
  },
  verify: {
    url: apiUrl + 'admin/verify?key=policical',
    method: 'get'
  }
}
var globalcrrentListType  //试题类型

let header = `
<h1 class="logo">
  <a href="index.html" title="华图政法">华图政法</a>
  <em class="line"></em>
  <span>书记员速录系统</span>
</h1>
<div class="fr" id="hlogin">
  <!-- 顶部导航 -->
  <a class="h-nav" :class="{'on':ifkd}" href="list-kd.html" title="看打练习">看打练习</a>
  <a class="h-nav" :class="{'on':iftd}" href="list-td.html" title="听打练习">听打练习</a>
  <!-- 已登录 -->
  <div class="if-login" v-if="iflogin">
    <span class="header-uid">{{ phone_hide }}</span>
    <div class="header-uchosse">
      <a href="record.html" title="练习记录">练习记录</a>
      <span title="点击退出" v-on:click="logout">退出</span>
    </div>
  </div>
  <!-- 未登录 -->
  <span class="else-login" v-else v-on:click="showLoingPop()"><i class="icon01"></i>快速登录</span>
</div>
`;

let footer = `
<p class="width footnav">
  <a href="#" title="">华图简介</a>
  <a href="#" title="">华图荣誉</a>
  <a href="#" title="">华图公益</a>
  <a href="#" title="">媒体关注</a>
  <a href="#" title="">联系我们</a>
  <a href="#" title="">法律声明</a>
  <a href="#" title="">负责声明</a>
  <a href="#" title="">网站导航</a>
  <a href="#" title="">投诉与建议</a>
  <a href="#" title="">申请友链</a>
  <a href="#" title="">加入我们</a>
</p>
<p>京ICP备 11028696号 京ICP证090387号 京公网安备 11010802010141 电信业务审批【2009】字第233号函</p>
`;

let popLayer = `
<div class="pop-box pop-login" id="popLogin">
  <span class="pop-close" @click="closePop"></span>
  <h3 class="pop-tit">登录</h3>
  <form id="loginForm">
    <div class="clearfix in-box">
      <input type="text" class="in-text" v-model="phone" name="phone" value="" placeholder="请输入手机号" autocomplete="off">
      <p class="war" v-show="phoneMessage">{{phoneMessage}}</p>
    </div>
    <div class="clearfix in-box verify-box" id="verifyBox" v-if="showVerify">
      <input type="text" class="in-text" v-model="verify" name="verify" value="" placeholder="请输入验证码" autocomplete="off">
      <img class="verify-img" :src="verifyUrl" onClick="this.src= urlConfig.verify.url + '&' + Math.random(); " alt="图形验证码" title="点击更换验证码">
      <p class="war" v-show="verifyMessage">{{verifyMessage}}</p>
    </div>
    <div class="clearfix in-box">
      <input type="text" class="in-text" v-model="code" name="code" value="" placeholder="请输入短信验证码" autocomplete="off">
      <input type="button" class="codebtn" v-bind:class="codebtnoff" v-bind:disabled="disabled" v-on:click="sendCode" :value="sendCodeBtn" >
      <p class="tip" v-show="loginMessage">{{loginMessage}}</p>
      <p class="war" v-show="codeMessage">{{codeMessage}}</p>
    </div>
    <input type="button" class="loginbtn" @click="login()" value="快速登录">
  </form>
</div>
`;

Vue.prototype.infomation = new Vue();

//顶部
new Vue({
  el: '#header',
  data: {
    header: header
  },
  created: function () {
  }
})

//登录
new Vue({
  el: '#hlogin',
  data: {
    ifkd: false,
    iftd: false,
    iflogin: false,
    phone_hide: ''
  },
  created: function () {

    if (globalcrrentListType == '160') {
      this.ifkd = true
    }
    if (globalcrrentListType == '161') {
      this.iftd = true
    }

    var self = this;

    this.phone_hide = getCookie('phone_hide');
    // if (this.phone_hide == null && getCookie('phone') && getCookie('token') && getCookie('userid')){
    //   this.iflogin = true;
    // } 
    console.log(this.phone_hide)
    if (this.phone_hide) this.iflogin = true;
    console.log(this.phone_hide)


    this.infomation.$on('modifyIfLogin', function (data) {
      self.iflogin = data
      self.phone_hide = getCookie('phone_hide');
    })
  },
  methods: {
    showLoingPop: function (event) {
      $('#popLayer').show();
    },
    logout: function () {
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
})

//底部
new Vue({
  el: '#footer',
  data: {
    footer: footer,
  }
})

Vue.component('pop-layer', {
  data: function () {
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
      },
    }
  },
  methods: {
    setRemainTime: function () {
      if (this.sysSecond > 0) {
        this.sysSecond = this.sysSecond - 1;
        var second = Math.floor(this.sysSecond % 60);
        var minite = Math.floor((this.sysSecond / 60) % 60);
        var hour = Math.floor((this.sysSecond / 3600) % 24);
        this.sendCodeBtn = second + '秒';
      } else {
        window.clearInterval(this.interValObj);
        this.sendCodeBtn = '立即发送';
        this.codebtnoff.codebtnoff = false
        this.disabled = false
        this.sysSecond = 60;
      }
    },
    sendCode: function () {
      var that = this;
      if (!this.phone) {
        this.phoneMessage = '请输入手机号';
        return false;
      }else {
        if (!(/^(1[0-9]{10})$/.test(this.phone))) {
          this.phoneMessage = '请输入有效的手机号码！';
          return false;
        }else{
          this.phoneMessage = null;
        }
      }
      var sendData = {
        'phone': this.phone,
        'timestamp': Date.parse(new Date()) / 1000
      }

      sendData.sign = getSign(sendData);

      $.ajax({
        url: urlConfig.getcode.url,
        method: urlConfig.getcode.method,
        data: sendData,
        dataType: 'json',
        async: false,
        success: function (res) {
          var code = res.code;
          var data = res.data;
          if (code != '200') {
            this.phoneMessage = res.msg;
            return false;
          }

          // 短信验证码发送成功
          that.phoneMessage = null;
          that.codebtnoff.codebtnoff = true
          that.disabled = true

          that.interValObj = window.setInterval(function () {
            that.setRemainTime();
          }, 1000);

        }
      })


    },
    login: function () {

      if (!this.phone) {
        this.phoneMessage = '请输入手机号';
        return false;
      } else{
        if (!(/^(1[0-9]{10})$/.test(this.phone))) {
          this.phoneMessage = '请输入有效的手机号码！';
          return false;
        } else{
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
      if(this.showVerify && !this.verify){
        this.verifyMessage = '请输入图片验证码';
        return false;
      }else{
        this.verifyMessage = null;
      }
      var sendData = {
        'phone': this.phone,
        'timestamp': Date.parse(new Date()) / 1000,
        'code': this.code,
      }

      if(this.showVerify){
        sendData.verify = this.verify
      }

      sendData.sign = getSign(sendData);
      
      var that = this
      $.ajax({
        url: urlConfig.codelogin.url,
        method: urlConfig.codelogin.method,
        data: sendData,
        dataType: 'json',
        success: function (res) {
          
          var resCode = res.code;
          var resData = res.data;

          if (resCode != '200') {
            if( resCode == '100003' ){
              that.verifyMessage = res.msg; //图形验证码错误
            } else if( resCode == '100004'){
              that.codeMessage = res.msg; //短信验证码错误
              that.loginMessage = null;
              that.codeError++;
              //短信验证码连续输入错误3次则必须输入图形验证码
              if(that.codeError >='3'){
                that.showVerify = true;
              }
            }else {
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
          $('#popLayer').hide()

          that.phoneMessage = null
          that.verifyMessage = null
          that.codeMessage = null
          that.loginMessage = '新用户登录后将自动创建账号'

          return false;

        }
      })


    },
    closePop: function (event) {
      $('#popLayer, #popReport').hide();
    }
  },
  template: popLayer
})

//弹窗
new Vue({
  el: '#popLayer',
  data: {},
  methods: {},
})


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
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
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
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

//获取学科
function getxuekelist(type) {
  var returnArr = [];

  var sendData = {
    subjectid: subjectid,
    datatype: type,
    timestamp: Date.parse(new Date()) / 1000
  }
  sendData.sign = getSign(sendData);

  //请求成功
  $.ajax({
    url: urlConfig.getxueke.url,
    method: urlConfig.getxueke.method,
    async: false,
    data: sendData,
    dataType: 'json',
    success: function (res) {
      if(type=='1'){
        returnArr = res.data.xueke;
      }else if(type=='2'){
        returnArr = res.data.questiontype;
      }else if(type=='3'){
        returnArr = res.data.speed;
      }else {
        returnArr = res.data;
      }
    }
  })
  return returnArr;
}