'use strict';

var popReport = '\n<div class="pop-box pop-report">\n    <span class="pop-close" @click="closePop"></span>\n    <h3 class="pop-tit minpop-tit">\u7EC3\u4E60\u62A5\u544A</h3>\n    <table>\n        <tr>\n            <th>\u7EC3\u4E60\u7528\u65F6</th>\n            <th>\u6B63\u786E\u7387</th>\n            <th>\u6253\u5B57\u901F\u5EA6</th>\n            <th>\u9000\u683C\u6B21\u6570</th>\n            <th>\u9519\u8BEF\u6B21\u6570</th>\n        </tr>\n        <tr>\n            <td><span class="usetime">{{report.usetime}}</span></td>\n            <td><span class="rightrate">{{report.rightrate}}</span></td>\n            <td><span class="speed">{{report.speed}}</span>\u5B57/\u5206</td>\n            <td><span class="backnum">{{report.backnum}}</span></td>\n            <td><span class="errornum">{{report.errornum}}</span></td>\n        </tr>\n    </table>\n    <p>\n        <span>\u79D1\u76EE\u7C7B\u522B\uFF1A{{questiontypename}}</span>\n        <span>\u7EC3\u4E60\u8BD5\u5377\uFF1A{{stem}}</span>\n        <span>\u7EC3\u4E60\u65F6\u95F4\uFF1A{{createtime}}</span>\n    </p>\n    <p>\n        <span>\u97F3\u9891\u901F\u5EA6\uFF1A{{speed}}</span>\n    </p>\n    <div class="clearfix btn-box">\n        <a class="btn" :href="answerLink" title="\u67E5\u770B\u7B54\u6848">\u67E5\u770B\u7B54\u6848</a>\n        <a class="btn" @click="reTest();" title="\u518D\u6B21\u7EC3\u4E60">\u518D\u6B21\u7EC3\u4E60</a>\n        <a class="btn more" :href="moreQuestionLink" title="\u5176\u4ED6\u7EC3\u4E60">\u5176\u4ED6\u7EC3\u4E60</a>\n    </div>\n</div>\n';

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
    this.listLink = 'list-td.html?xuekeid=' + this.xueke.id;
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
// 实时计算打字速度
var computedSpee = function computedSpee() {
  var messageLength = 0;
  messageLength = tddetail.textMessage.length;
  var currentMinute = minute <= 0 ? 1 : minute;
  console.log(messageLength, currentMinute, minute);
  var speed = parseInt(messageLength / currentMinute);
  $('span .speed').text(speed + '字/分');
};
//计时器
var minute = 0;
var second = 0;
var totalSecond = 0;
var millisecond = 0;
var nowTime;
var i = 0;
function showTime() {

  second++;
  totalSecond++;
  if (second >= 60) {
    second = 0;
    minute++;
  }
  $('#showTime').text((minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second));
  if (audio.duration >= totalSecond) {
    $('.tddetail-audio .progress').text((minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second));
  }
  computedSpee();
}

//听打详情
var tddetail = new Vue({
  el: '#tddetail',
  data: {
    audioSrc: null,
    isActive: false,
    textMessage: null,
    textMessageFilter: null,
    deleteCount: null,
    maxLength: null,
    answer: null
  },
  watch: {
    textMessage: function textMessage() {
      this.textMessageFilter = this.textMessage.replace(/([^0-9|^a-z|^A-Z|^\u4e00-\u9fa5])*/g, '');
      if (!this.textMessage) {
        $('.submitBtn').attr('disabled', true).addClass('disabled');
      } else {
        $('.submitBtn').attr('disabled', false).removeClass('disabled');
      }
    }
  },
  created: function created() {
    var returnArr = [];
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
      data: sendData,
      dataType: 'json',
      async: false,
      success: function success(res) {
        returnArr = res.data;
      }
    });

    $('#questionTitle b').text(returnArr.stem);
    $('.tddetail-audio .type').text('(' + returnArr.speed + '字/分钟)');
    // TUDO 替换音频地址
    this.audioSrc = returnArr.audiourl;
    this.answer = returnArr.answer.replace(/([^0-9|^a-z|^A-Z|^\u4e00-\u9fa5])*/g, '');
    this.maxLength = returnArr.answer.length;
  },
  methods: {
    //比较
    compare: function compare() {
      var textMessage = this.textMessage;
      // var messageLength = 0;
      // messageLength = this.textMessage.length;
      // var currentMinute = minute <= 0 ? 1 : minute;
      // console.log(messageLength, currentMinute, minute)
      // var speed = parseInt( messageLength / currentMinute)
      // $('span .speed').text(speed + '字/分');
    },
    //退格
    deleteK: function deleteK() {
      if (!this.textMessage) {
        return false;
      }
      this.deleteCount++;
      $('.dtimes').text(this.deleteCount);
    }
  }
});

//音频
var audio = $('#tdaudio')[0];
var audioLength;
var audioCurrent;
var ifAudioPlay = true;
//音频长度
audio.onloadedmetadata = function () {
  if (parseInt(audio.duration / 60) < 1) {
    audioLength = '00:' + parseInt(audio.duration);
  } else {
    audioLength = parseInt(audio.duration / 60) + ':' + parseInt(audio.duration % 60);
  }
  $('.tddetail-audio .length').text('/' + audioLength);
};
// 音频已结束
audio.onended = function () {
  ifAudioPlay = false;
};

//开始听打
$('.tdbtn-box').on('click', '.startBtn', function () {
  if (nowTime != undefined) {
    //计时器已开启
  } else {
    nowTime = setInterval(function () {
      showTime();
    }, 1000);
  }

  $('.startBtn').val('暂停').removeClass('startBtn').addClass('pauseBtn');
  $('.resetBtn').attr('disabled', false);
  $('.resetBtn').removeClass('disabled');

  audio.play();
  $('#in-text').attr('disabled', false).focus();
  tddetail.isActive = true;
});

//暂停听打
$('.tdbtn-box').on('click', '.pauseBtn', function () {
  window.clearInterval(nowTime);
  nowTime = undefined;
  $('.pauseBtn').val('继续').removeClass('pauseBtn').addClass('continueBtn');

  audio.pause();
  $('#in-text').attr('disabled', true);
  tddetail.isActive = false;
});

//继续听打
$('.tdbtn-box').on('click', '.continueBtn', function () {
  if (nowTime != undefined) {
    //计时器已开启
  } else {
    nowTime = setInterval(function () {
      showTime();
    }, 1000);
  }
  $('.continueBtn').val('暂停').removeClass('continueBtn').addClass('pauseBtn');

  if (ifAudioPlay) {
    audio.play();
  }
  $('#in-text').attr('disabled', false).focus();
  tddetail.isActive = true;
});

//重做
$('.tdbtn-box').on('click', '.resetBtn', function () {
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
      that.moreQuestionLink = that.moreQuestionLink + '?xuekeid=' + data.xuekeid + '&speed=' + data.speed;
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
$('.tdbtn-box').on('click', '.submitBtn', function () {
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
    questionid: getQueryVariable('qid'),
    timestamp: Date.parse(new Date()) / 1000
  };
  sendData.usetime = second + minute * 60;
  sendData.sign = getSign(sendData);

  var answerStr = [];
  var totalCount = 0;
  var inputCount = 0;
  var rightCount = 0;
  var errorCount = 0;
  var pStr = tddetail.answer;
  var inputStr = tddetail.textMessageFilter;

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
    answer: tddetail.textMessage
  };

  var report = {};
  console.log(totalCount, rightCount, inputStr, inputStr.length, '222');
  report.usetime = $('#showTime').text();
  // report.rightrate = ((rightCount / inputStr.length)*100).toFixed(2)+'%';
  report.rightrate = (rightCount / inputCount * 100).toFixed(2) + '%';
  report.speed = parseInt($('.speed').text());
  report.backnum = parseInt($('.dtimes').text());
  report.errornum = errorCount;
  sendData.report = JSON.stringify(report);
  sendData.answer = JSON.stringify(answerStr);
  sendData.userid = getCookie('userid');

  var sendRecordData = {
    subjectid: subjectid,
    xuekeid: '0',
    questiontype: globalcrrentListType,
    timestamp: Date.parse(new Date()) / 1000
  };

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
  $('#popLayer,.tdbtn-box .btn:gt(0)').hide();
  $('#popReport').show();
});