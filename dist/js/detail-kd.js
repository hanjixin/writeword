'use strict';

var popReport = '\n<div class="pop-box pop-report">\n    <span class="pop-close" @click="closePop"></span>\n    <h3 class="pop-tit minpop-tit">\u7EC3\u4E60\u62A5\u544A</h3>\n    <table>\n        <tr>\n            <th>\u7EC3\u4E60\u7528\u65F6</th>\n            <th>\u6B63\u786E\u7387</th>\n            <th>\u6253\u5B57\u901F\u5EA6</th>\n            <th>\u9000\u683C\u6B21\u6570</th>\n            <th>\u9519\u8BEF\u6B21\u6570</th>\n        </tr>\n        <tr>\n            <td><span class="usetime">{{report.usetime}}</span></td>\n            <td><span class="rightrate">{{report.rightrate}}</span></td>\n            <td><span class="speed">{{report.speed}}</span>\u5B57/\u5206</td>\n            <td><span class="backnum">{{report.backnum}}</span></td>\n            <td><span class="errornum">{{report.errornum}}</span></td>\n        </tr>\n    </table>\n    <p>\n        <span>\u79D1\u76EE\u7C7B\u522B\uFF1A{{questiontypename}}</span>\n        <span>\u7EC3\u4E60\u8BD5\u5377\uFF1A{{stem}}</span>\n        <span>\u7EC3\u4E60\u65F6\u95F4\uFF1A{{createtime}}</span>\n    </p>\n    <div class="clearfix btn-box">\n        <a class="btn" :href="answerLink" title="\u67E5\u770B\u7B54\u6848">\u67E5\u770B\u7B54\u6848</a>\n        <a class="btn" @click="reTest();" title="\u518D\u6B21\u7EC3\u4E60">\u518D\u6B21\u7EC3\u4E60</a>\n        <a class="btn more" :href="moreQuestionLink" title="\u5176\u4ED6\u7EC3\u4E60">\u5176\u4ED6\u7EC3\u4E60</a>\n    </div>\n</div>\n';

//左侧学科类别
Vue.component('left-nav', {
  props: ['xueke', 'xuekeId', 'index'],
  data: function data() {
    return {
      iconClass: '',
      isActive: false,
      listLink: ''
    };
  },
  created: function created() {
    this.iconClass = 'icon10' + this.index;
    this.listLink = 'list-kd.html?xuekeid=' + this.xueke.id;
    if (getQueryVariable('xuekeid')) {
      if (getQueryVariable('xuekeid') == this.xueke.id) {
        this.isActive = true;
      }
    } else {
      this.isActive = this.index == '1' ? true : false;
    }
  },
  template: '\n  <a :title="xueke.xueke" \n  :class="{on:isActive}"\n  :data-xuekeId="xueke.id" \n  :href="listLink"\n  ><i :class="iconClass"></i>{{xueke.xueke}}</a>\n  '
});
if ($('#leftNav').length > 0) {
  new Vue({
    el: '#leftNav',
    data: {
      xuekes: []
    },
    created: function created() {
      this.xuekes = getxuekelist('1');
    },
    methods: {}
  });
}

//看打详情
Vue.component('kddetail', {
  props: ['stem', 'index'],
  data: function data() {
    return {
      nameIndex: '',
      inputMessage: '',
      deleteCount: 0,
      answer: null,
      questionid: null,
      questiontype: null
    };
  },
  created: function created() {
    this.nameIndex = 'inputarr' + this.index;
    this.inputMessage = '';
  },
  methods: {
    //比较
    compare: function compare() {
      var message = this.stem;
      var inputMessage = this.inputMessage;
      var messageArr = message.split('');
      // var messageLength = 0;

      for (var i = 0; i < inputMessage.length; i++) {
        if (message[i] == inputMessage[i]) {
          messageArr[i] = '<span class="right">' + message[i] + '</span>';
        } else {
          messageArr[i] = '<span class="error">' + message[i] + '</span>';
        }
      }
      $('p[p-identify=' + this.index + ']').html(messageArr.join(''));

      // for (var i = 0; i < $('#kddetail li input').length; i++) {
      //   messageLength = messageLength + $('#kddetail li input').eq(i).val().length;
      // }

      // //打字速度
      // var currentMinute = minute <= 0 ? 1 : minute;
      // var speed = parseInt(messageLength / currentMinute)
      // $('span .speed').text(speed + '字/分');

      if (inputMessage.length == message.length) {
        var nextLiObj = $('p[p-identify=' + this.index + ']').parent('li').removeClass('on').next();
        if (nextLiObj.length == 0) {
          $('p[p-identify=' + this.index + ']').parent('li').addClass('on');
          return false;
        }
        nextLiObj.addClass('on');
        nextLiObj.find('input').attr('disabled', false).focus();
        return false;
      }
    },
    //退格
    deleteK: function deleteK() {

      var thisLiObj = $('#kddetail .on');
      if (thisLiObj.prev().length > 0 && thisLiObj.find('input').val().length < 1) {
        thisLiObj.removeClass('on');
        thisLiObj.prev().addClass('on').find('input').focus();
      }

      if (!this.inputMessage) {
        return false;
      }

      this.$emit('deletekey');

      //this.deleteCount++;
    }
  },
  template: '\n    <li :index="index"\n        :class="{on:index==0}"\n    >\n    <p :p-identify="index">{{stem}}</p>\n    <input type="text" class="in-text" autocomplete="off" disabled oncopy="return false" onpaste="return false"\n        :maxlength="stem.length"\n        :name="nameIndex"\n        v-model="inputMessage"\n        @keyup="compare()" \n        @keydown.delete="deleteK()"\n    >\n    </li>'
});

new Vue({
  el: '#kddetail',
  data: {
    deleteCount: 0
  },
  created: function created() {
    var stem_arr = [];
    var stem = '';
    var sendData = {
      subjectid: subjectid,
      timestamp: Date.parse(new Date()) / 1000
    };
    if (getQueryVariable('qid')) {
      sendData.questionid = getQueryVariable('qid');
    }
    if (getQueryVariable('xuekeid')) {
      sendData.xuekeid = getQueryVariable('xuekeid');
    }
    sendData.sign = getSign(sendData);

    //请求成功
    $.ajax({
      url: urlConfig.getquestiondetail.url,
      method: urlConfig.getquestiondetail.method,
      async: false,
      data: sendData,
      dataType: 'json',
      success: function success(res) {
        var htmlDiv = document.createElement('div');
        stem_arr = res.data.stem_arr.map(function (item) {
          htmlDiv.innerHTML = item;
          return htmlDiv.innerText;
        });
        console.log(stem_arr, res.data.stem);
        stem = res.data.stem;
      }
    });

    this.stems = stem_arr;
    $('#questionTitle b').text(stem);
  },
  methods: {
    deletekey: function deletekey() {
      this.deleteCount++;
      $('.dtimes').text(this.deleteCount);
    }
  }
});

// 实时计算打字速度
var computedSpee = function computedSpee() {
  var messageLength = 0;

  for (var i = 0; i < $('#kddetail li input').length; i++) {
    messageLength = messageLength + $('#kddetail li input').eq(i).val().length;
  }

  //打字速度
  var currentMinute = minute <= 0 ? 1 : minute;
  // var speed = parseInt(messageLength / ((currentMinute * 60 + second) / 60))
  var speed = (messageLength / (currentMinute <= 1 ? 1 : (currentMinute * 60 + second) / 60)).toFixed(0);
  $('span .speed').text(speed + '字/分');
};

//计时器
var minute = 0;
var second = 0;
var millisecond = 0;
var nowTime;
var i = 0;
function showTime() {
  millisecond++;
  if (millisecond >= 100) {
    millisecond = 0;
    second++;
  }
  if (second >= 60) {
    second = 0;
    minute++;
  }
  $('#showTime').text((minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second));
  computedSpee();
}

//开始看打
$('.kdbtn-box').on('click', '.startBtn', function () {
  if (nowTime != undefined) {
    //计时器已开启
  } else {
    nowTime = setInterval(function () {
      showTime();
    }, 10);
  }
  $('.startBtn').val('暂停').removeClass('startBtn').addClass('pauseBtn');
  $('.resetBtn, .submitBtn').attr('disabled', false);
  $('.resetBtn, .submitBtn').removeClass('disabled');

  var inputObj = $('#kddetail .on input');
  inputObj.attr('disabled', false).focus();
});

//暂停看打
$('.kdbtn-box').on('click', '.pauseBtn', function () {
  window.clearInterval(nowTime);
  nowTime = undefined;
  $('.pauseBtn').val('继续').removeClass('pauseBtn').addClass('continueBtn');

  var inputObj = $('#kddetail input');

  inputObj.attr('disabled', true);
});

//继续看打
$('.kdbtn-box').on('click', '.continueBtn', function () {
  nowTime = setInterval(function () {
    showTime();
  }, 10);
  $('.continueBtn').val('暂停').removeClass('continueBtn').addClass('pauseBtn');

  var inputObj = $('#kddetail .on input');
  inputObj.attr('disabled', false).focus();
});

//重做
$('.kdbtn-box').on('click', '.resetBtn', function () {
  location.reload();
});

//报告弹窗
Vue.component('pop-report', {
  data: function data() {
    return {
      questiontypename: 'null',
      stem: null,
      speed: null,
      createtime: null,
      report: {
        usetime: null,
        rightrate: null,
        backnum: null,
        errornum: null
      },
      answerLink: null,
      moreQuestionLink: null
    };
  },
  created: function created() {
    var that = this;
    this.infomation.$on('submitAnswer', function (data) {

      that.questiontypename = data.questiontypename;
      that.stem = data.stem;
      that.speed = data.speed;
      that.createtime = data.createtime;
      that.report = data.report;
      that.answerLink = 'answer.html?reportid=' + data.id + '&xuekeid=' + data.xuekeid + '&qid=' + data.questionid;
      if (data.questiontypeid == '161') {
        that.moreQuestionLink = 'list-td.html';
      } else {
        that.moreQuestionLink = 'list-kd.html';
      }
      that.moreQuestionLink = that.moreQuestionLink + '?xuekeid=' + data.xuekeid;
    });
  },
  methods: {
    closePop: function closePop() {
      $('#popReport').hide();
    },
    reTest: function reTest() {
      location.reload();
    }
  },
  template: popReport
});

new Vue({
  el: '#popReport',
  data: {},
  methods: {}
});

//提交
$('.kdbtn-box').on('click', '.submitBtn', function () {
  // 停止计时
  window.clearInterval(nowTime);
  nowTime = undefined;
  // 判断登录
  if (!checkLogin()) {
    $('#popLayer').show();
    return false;
  }

  var sendData = {
    subjectid: subjectid,
    xuekeid: getQueryVariable('xuekeid'),
    questiontype: globalcrrentListType,
    timestamp: Date.parse(new Date()) / 1000
  };
  sendData.questionid = getQueryVariable('qid');
  sendData.usetime = second + minute * 60;
  sendData.sign = getSign(sendData);

  var answerStr = [];
  var totalCount = 0;
  var rightCount = 0;
  var errorCount = 0;
  var inputCount = 0;
  for (var i = 0; i < $('#kddetail li').length; i++) {

    var pStr = $('#kddetail li').eq(i).find('p').text();
    var inputStr = $('#kddetail li').eq(i).find('input').val();

    totalCount += pStr.length;
    inputCount += inputStr.length;
    for (var j = 0; j < pStr.length; j++) {
      if (pStr[j] == inputStr[j]) {
        rightCount += 1;
      } else {
        if (inputStr[j]) {
          errorCount += 1;
        }
      }
    }

    answerStr[i] = {
      stem: pStr,
      answer: inputStr
    };
  }
  var report = {};
  report.usetime = $('#showTime').text();
  // report.rightrate = ((rightCount / totalCount)*100).toFixed(2)+'%';
  report.rightrate = (rightCount / inputCount * 100).toFixed(2) + '%';
  report.speed = parseInt($('.speed').text());
  report.backnum = parseInt($('.dtimes').text());
  report.errornum = errorCount;
  sendData.answer = JSON.stringify(answerStr);
  sendData.report = JSON.stringify(report);
  sendData.userid = getCookie('userid');

  //提交答案
  var returnId;
  $.ajax({
    headers: {
      'Authorization': 'Bearer ' + getCookie('token')
    },
    url: urlConfig.submitanswer.url,
    method: urlConfig.submitanswer.method,
    data: sendData,
    dataType: 'json',
    async: false,
    success: function success(res) {
      if (res.code == '10018') {
        $('#popLayer').show();
        return false;
      }
      returnId = res.data.id;
    },
    error: function error(res) {
      return false;
    }
  });

  //显示报告
  var sendrecData = {
    subjectid: subjectid,
    xuekeid: getQueryVariable('xuekeid'),
    questiontype: globalcrrentListType,
    timestamp: Date.parse(new Date()) / 1000
  };
  sendrecData.id = returnId;
  sendrecData.sign = getSign(sendrecData);
  var returnRecord;
  $.ajax({
    headers: {
      'Authorization': 'Bearer ' + getCookie('token')
    },
    url: urlConfig.getrecorddetail.url,
    method: urlConfig.getrecorddetail.method,
    data: sendrecData,
    dataType: 'json',
    async: false,
    success: function success(res) {
      returnRecord = res.data;
    },
    error: function error(res) {
      return false;
    }
  });
  new Vue().infomation.$emit('submitAnswer', returnRecord);
  $('#popLayer,.kdbtn-box .btn:gt(0)').hide();
  $('#popReport').show();
});
