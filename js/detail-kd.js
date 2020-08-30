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
    this.listLink = 'list-kd.html?xuekeid=' + this.xueke.id;
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

//看打详情
Vue.component('kddetail', {
  props: ['stem','index'],
  data: function () {
    return {
      nameIndex: '',
      inputMessage: '',
      deleteCount: 0,
      answer: null,
      questionid: null,
      questiontype: null
    };
  },
  created: function () {
    this.nameIndex = 'inputarr' + this.index
    this.inputMessage = ''
  },
  methods: {
    //比较
    compare: function () {
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
          $('p[p-identify=' + this.index + ']').parent('li').addClass('on')
          return false;
        }
        nextLiObj.addClass('on');
        nextLiObj.find('input').attr('disabled', false).focus();
        return false;
      }


    },
    //退格
    deleteK: function () {

      var thisLiObj = $('#kddetail .on');
      if(thisLiObj.prev().length > 0 && thisLiObj.find('input').val().length<1){
        thisLiObj.removeClass('on');
        thisLiObj.prev().addClass('on').find('input').focus();
      }

      if(!this.inputMessage){
        return false;
      }
      
      this.$emit('deletekey');
    
      //this.deleteCount++;
      
    },
  },
  template: `
    <li :index="index"
        :class="{on:index==0}"
    >
    <p :p-identify="index">{{stem}}</p>
    <input type="text" class="in-text" autocomplete="off" disabled oncopy="return false" onpaste="return false"
        :maxlength="stem.length"
        :name="nameIndex"
        v-model="inputMessage"
        @keyup="compare()" 
        @keydown.delete="deleteK()"
    >
    </li>`
})

new Vue({
  el: '#kddetail',
  data: {
    deleteCount:0
  },
  created: function () {
    var stem_arr = [];
    var stem = '';
    var sendData = {
      subjectid: subjectid,
      timestamp: Date.parse(new Date()) / 1000
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
      async: false,
      data: sendData,
      dataType: 'json',
      success: function (res) {
        var htmlDiv  = document.createElement('div')
        stem_arr = res.data.stem_arr.map(function(item) {
          htmlDiv.innerHTML = item
          return htmlDiv.innerText
        })
        console.log(stem_arr, res.data.stem)
        stem = res.data.stem
      }
    })

    this.stems = stem_arr;
    $('#questionTitle b').text(stem);

  },
  methods: {
    deletekey:function(){
      this.deleteCount++;
      $('.dtimes').text(this.deleteCount);
    }
  }
})

// 实时计算打字速度
var computedSpee = function() {
  var messageLength = 0;

  for (var i = 0; i < $('#kddetail li input').length; i++) {
    messageLength = messageLength + $('#kddetail li input').eq(i).val().length;
  }

  //打字速度
  var currentMinute = minute <= 0 ? 1 : minute;
  // var speed = parseInt(messageLength / ((currentMinute * 60 + second) / 60))
  var speed = (messageLength / (currentMinute <=1 ? 1 : ((currentMinute * 60 + second) / 60))).toFixed(0)
  $('span .speed').text(speed + '字/分');
  // $('span .speed').text(messageLength + `字/${(minute * 60 + second) / 60}分`);git
}

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
  $('#showTime').text((minute < 10 ? ('0' + minute) : minute) + ':' + (second < 10 ? ('0' + second) : second));
  computedSpee()
}

//开始看打
$('.kdbtn-box').on('click', '.startBtn', function () {

  if (nowTime != undefined) {
    //计时器已开启
  } else {
    nowTime = setInterval(function () {
      showTime();
      if(second || minute) {
        $('.resetBtn, .submitBtn').attr('disabled', false);
        $('.resetBtn, .submitBtn').removeClass('disabled');
      }
    }, 10);
  }
  $('.startBtn').val('暂停').removeClass('startBtn').addClass('pauseBtn');
  // $('.resetBtn, .submitBtn').attr('disabled', false);
  // $('.resetBtn, .submitBtn').removeClass('disabled');

  var inputObj = $('#kddetail .on input');
  inputObj.attr('disabled', false).focus();
})

//暂停看打
$('.kdbtn-box').on('click', '.pauseBtn', function () {
  window.clearInterval(nowTime);
  nowTime = undefined;
  $('.pauseBtn').val('继续').removeClass('pauseBtn').addClass('continueBtn');

  var inputObj = $('#kddetail input');

  inputObj.attr('disabled', true);
})

//继续看打
$('.kdbtn-box').on('click', '.continueBtn', function () {
  nowTime = setInterval(function () {
    showTime();
  }, 10);
  $('.continueBtn').val('暂停').removeClass('continueBtn').addClass('pauseBtn');

  var inputObj = $('#kddetail .on input');
  inputObj.attr('disabled', false).focus();
})

//重做
$('.kdbtn-box').on('click', '.resetBtn', function () {
  location.reload();
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
      that.moreQuestionLink = that.moreQuestionLink+ '?xuekeid=' + data.xuekeid
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
$('.kdbtn-box').on('click', '.submitBtn', function () {
  // 停止计时

  window.clearInterval(nowTime);
  nowTime = undefined;
  // 判断登录
  if (!checkLogin()) {
    $('#popLayer').show();
    $('.login-tips').text('亲，登录后才可查看报告哦！').show()
    return false;
  }

  var sendData ={
    subjectid: subjectid,
    xuekeid: getQueryVariable('xuekeid'),
    questiontype: globalcrrentListType,
    timestamp: Date.parse(new Date()) / 1000
  }
  sendData.questionid = getQueryVariable('qid');
  sendData.usetime = second + (minute * 60);
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
        if(inputStr[j]) {
          errorCount += 1;
        }
      }
    }

    answerStr[i] = {
      stem: pStr,
      answer: inputStr
    }
  }
  var report = {};
  report.usetime = $('#showTime').text();
  // report.rightrate = ((rightCount / totalCount)*100).toFixed(2)+'%';
  report.rightrate = (inputCount ? (rightCount / inputCount)*100 : 0).toFixed(2)+'%';
  report.speed = parseInt($('.speed').text());
  report.backnum = parseInt($('.dtimes').text());
  report.errornum = errorCount;
  sendData.answer = JSON.stringify(answerStr);
  sendData.report = JSON.stringify(report);
  sendData.userid = getCookie('userid')

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
    },
    error:function(res){
      return false
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
  $('#popLayer,.kdbtn-box .btn:gt(0)').hide();
  $('#popReport').show();

})
