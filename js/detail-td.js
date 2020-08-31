'use strict';
let popReport = `
<div class="pop-box pop-report">
    <span class="pop-close" @click="closePop"></span>
    <h3 class="pop-tit minpop-tit">练习报告</h3>
    <table>
        <tr>
            <th>练习用时</th>
            <th>正确率</th>
            <th>打字速度</th>
            <th>退格次数</th>
            <th>错误次数</th>
        </tr>
        <tr>
            <td><span class="usetime">{{report.usetime}}</span></td>
            <td><span class="rightrate">{{report.rightrate}}</span></td>
            <td><span class="speed">{{report.speed}}</span>字/分</td>
            <td><span class="backnum">{{report.backnum}}</span></td>
            <td><span class="errornum">{{report.errornum}}</span></td>
        </tr>
    </table>
    <p>
        <span>科目类别：{{questiontypename}}</span>
        <span>练习试卷：{{stem}}</span>
        <span>练习时间：{{createtime}}</span>
    </p>
    <p>
        <span>音频速度：{{speed}}</span>
    </p>
    <div class="clearfix btn-box">
        <a class="btn" :href="answerLink" title="查看答案">查看答案</a>
        <a class="btn" @click="reTest();" title="再次练习">再次练习</a>
        <a class="btn more" :href="moreQuestionLink" title="其他练习">其他练习</a>
    </div>
</div>
`;

//左侧学科类别
Vue.component('left-nav', {
  props: ['xueke', 'xuekeId', 'index'],
  data: function () {
    return {
      iconClass: '',
      isActive: false,
      listLink: ''
    };
  },
  created: function () {
    this.iconClass = 'icon10' + this.index;
    this.listLink = 'list-td.html?xuekeid=' + this.xueke.id;
    if( getQueryVariable('xuekeid')){
      if( getQueryVariable('xuekeid') == this.xueke.id){
        this.isActive = true
      }
    } else {
      this.isActive = this.index=='1'? true :false
    }
  },
  template: `
  <a :title="xueke.xueke" 
  :class="{on:isActive}"
  :data-xuekeId="xueke.id" 
  :href="listLink"
  ><i :class="iconClass"></i>{{xueke.xueke}}</a>
  `
})
if ($('#leftNav').length > 0) {
  new Vue({
    el: '#leftNav',
    data: {
      xuekes: [],
    },
    created: function () {
      this.xuekes = getxuekelist('1');
    },
    methods: {}
  })
}
// 实时计算打字速度
var computedSpee = function() {
  var messageLength = 0;
      messageLength =  tddetail.textMessage.length;
      var currentMinute = minute <= 0 ? 1 : minute;
      var currentSecond = second <= 0 ? 1 : second;
      console.log(messageLength, currentMinute, minute)
      // var speed = parseInt( messageLength / currentMinute)
      var speed = parseInt(messageLength / ((minute * 60 + currentSecond) / 60))
      $('span .speed').text(speed + '字/分');
}
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
  $('#showTime').text((minute < 10 ? ('0' + minute) : minute) + ':' + (second < 10 ? ('0' + second) : second));
  if(audio.duration >= totalSecond){
    $('.tddetail-audio .progress').text((minute < 10 ? ('0' + minute) : minute) + ':' + (second < 10 ? ('0' + second) : second));
  }
  computedSpee()
}


//听打详情
var tddetail = new Vue({
  el: '#tddetail',
  data: {
    audioSrc: null,
    isActive: false,
    textMessage:null,
    textMessageFilter:null,
    deleteCount:null,
    maxLength:null,
    answer:null,
  },
  watch:{
    textMessage:function(){
      this.textMessageFilter = this.textMessage.replace(/([^0-9|^a-z|^A-Z|^\u4e00-\u9fa5])*/g,'');
      if(!this.textMessage){
        $('.submitBtn').attr('disabled',true).addClass('disabled');
      }else{
        $('.submitBtn').attr('disabled',false).removeClass('disabled');
      }
    },
  },
  created: function () {
    var returnArr = [];
    var sendData = {
      subjectid: subjectid,
      timestamp: (Date.parse(new Date()) / 1000)
    }
    if(getQueryVariable('qid')){
      sendData.questionid = getQueryVariable('qid')
    }
    if(getQueryVariable('xuekeid')){
      sendData.xuekeid = getQueryVariable('xuekeid')
    }
    sendData.sign = getSign(sendData);

    //请求成功
    $.ajax({
      url: urlConfig.getquestiondetail.url,
      method: urlConfig.getquestiondetail.method,
      data: sendData,
      dataType: 'json',
      async: false,
      success: function (res) {
        returnArr = res.data
      }
    })

    $('#questionTitle b').text(returnArr.stem);
    $('.tddetail-audio .type').text('('+returnArr.speed+'字/分钟)');
    // TUDO 替换音频地址
    this.audioSrc = returnArr.audiourl;
    this.answer = returnArr.answer.replace(/([^0-9|^a-z|^A-Z|^\u4e00-\u9fa5])*/g,'');
    this.maxLength = returnArr.answer.length;

  },
  methods: {
    //比较
    compare: function () {
      var textMessage = this.textMessage;
      // var messageLength = 0;
      // messageLength = this.textMessage.length;
      // var currentMinute = minute <= 0 ? 1 : minute;
      // console.log(messageLength, currentMinute, minute)
      // var speed = parseInt( messageLength / currentMinute)
      // $('span .speed').text(speed + '字/分');
    },
    //退格
    deleteK: function () {
      if(!this.textMessage){
        return false;
      }
      this.deleteCount++;
      $('.dtimes').text(this.deleteCount);
    },
  }
})

//音频
var audio = $('#tdaudio')[0];
var audioLength
var audioCurrent
var ifAudioPlay = true
//音频长度
audio.onloadedmetadata = function () {
  if(parseInt(audio.duration / 60)< 1){
    audioLength = '00:' + parseInt(audio.duration);
  } else {
    audioLength = parseInt(audio.duration / 60) +':'+ parseInt(audio.duration % 60);
  }
  $('.tddetail-audio .length').text('/'+ audioLength);
};
// 音频已结束
audio.onended = function() {
  ifAudioPlay = false
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
  tddetail.isActive = true
})

//暂停听打
$('.tdbtn-box').on('click', '.pauseBtn', function () {
  window.clearInterval(nowTime);
  nowTime = undefined;
  $('.pauseBtn').val('继续').removeClass('pauseBtn').addClass('continueBtn');
  
  audio.pause();
  $('#in-text').attr('disabled', true);
  tddetail.isActive = false
})

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
  
  if(ifAudioPlay){
    audio.play();
  }
  $('#in-text').attr('disabled', false).focus();
  tddetail.isActive = true
})

//重做
$('.tdbtn-box').on('click', '.resetBtn', function () {
  location.reload();
})
// 关闭登录弹窗
$('.pop-close').click(function(){
  console.log($('.continueBtn').val())
  if($('.continueBtn').val() == '继续') {
    // return
  } else {
    nowTime = setInterval(function () {
      showTime();
    }, 1000);
    if(ifAudioPlay){
      audio.play();
    }
    $('.continueBtn').val('暂停').removeClass('continueBtn').addClass('pauseBtn');
  }
  
})
$('.else-login').click(function(){
  window.clearInterval(nowTime);
  audio.pause();
})

//报告弹窗
Vue.component('pop-report', {
  data: function () {
    return {
      questiontypename: 'null',
      stem: null,
      speed: null,
      createtime: null,
      report: {
        usetime: null,
        rightrate: null,
        backnum: null,
        errornum: null,
      },
      answerLink: null,
      moreQuestionLink: null,
    }
  },
  created: function () {
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
      that.moreQuestionLink = that.moreQuestionLink+ '?xuekeid=' + data.xuekeid +'&speed=' + data.speed;
    });
  },
  methods: {
    closePop: function () {
      $('#popReport').hide();
    },
    reTest: function () {
      location.reload();
    }
  },
  template: popReport
})

new Vue({
  el: '#popReport',
  data: {},
  methods: {},
})

//提交
$('.tdbtn-box').on('click', '.submitBtn', function () {
  // 停止计时
  window.clearInterval(nowTime);
  audio.pause();
  nowTime = undefined;
  // 判断登录
  if (!checkLogin()) {
    $('#popLayer').show();
    $('.pop-box h3').hide()
    $('.login-tips').text('亲，登录后才可查看报告哦！').show();
    return false;
  }


  var sendData = {
    subjectid: subjectid,
    xuekeid: getQueryVariable('xuekeid'),
    questiontype: globalcrrentListType,
    questionid: getQueryVariable('qid'),
    timestamp: Date.parse(new Date()) / 1000
  };
  sendData.usetime = second + (minute * 60);
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
      if(inputStr[j]) {
        errorCount += 1;
      }
    }
  }

  answerStr[i] = {
    stem: pStr,
    answer: tddetail.textMessage
  }

  var report = {};
  console.log(totalCount, rightCount,inputStr,inputStr.length, '222')
  report.usetime = $('#showTime').text();
  // report.rightrate = ((rightCount / inputStr.length)*100).toFixed(2)+'%';
  report.rightrate = ((rightCount / inputCount)*100).toFixed(2)+'%';
  report.speed = parseInt($('.speed').text());
  report.backnum = parseInt($('.dtimes').text());
  report.errornum = errorCount;
  sendData.report = JSON.stringify(report);
  sendData.answer = JSON.stringify(answerStr);
  sendData.userid = getCookie('userid')
  
  var sendRecordData = {
    subjectid: subjectid,
    xuekeid: '0',
    questiontype: globalcrrentListType,
    timestamp: Date.parse(new Date()) / 1000
  };

  //提交答案
  var returnId
  $.ajax({
    headers: {
      'Authorization':'Bearer '+getCookie('token')
    },
    url: urlConfig.submitanswer.url,
    method: urlConfig.submitanswer.method,
    data: sendData,
    dataType: 'json',
    async: false,
    success: function (res) {
      if( res.code == '10018' ){
        $('#popLayer').show();
        return false
      } 
      returnId = res.data.id;
    }
  })

  //显示报告
  var sendrecData = {
    subjectid: subjectid,
    xuekeid: getQueryVariable('xuekeid'),
    questiontype: globalcrrentListType,
    timestamp: Date.parse(new Date()) / 1000
  };
  sendrecData.id = returnId;
  sendrecData.sign = getSign(sendrecData);
  var returnRecord
  $.ajax({
    headers: {
      'Authorization':'Bearer '+getCookie('token')
    },
    url: urlConfig.getrecorddetail.url,
    method: urlConfig.getrecorddetail.method,
    data: sendrecData,
    dataType: 'json',
    async: false,
    success: function (res) {
      returnRecord = res.data

    },
    error:function(res){
      return false
    }
  })
  new Vue().infomation.$emit('submitAnswer', returnRecord);
  $('#popLayer,.tdbtn-box .btn:gt(0)').hide();
  $('#popReport').show();

})