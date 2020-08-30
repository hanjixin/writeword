'use strict';

var popReport = '\n<div class="pop-box pop-report">\n    <span class="pop-close" @click="closePop"></span>\n    <h3 class="pop-tit minpop-tit">\u7EC3\u4E60\u62A5\u544A</h3>\n    <table>\n        <tr>\n            <th>\u7EC3\u4E60\u7528\u65F6</th>\n            <th>\u6B63\u786E\u7387</th>\n            <th>\u6253\u5B57\u901F\u5EA6</th>\n            <th>\u9000\u683C\u6B21\u6570</th>\n            <th>\u9519\u8BEF\u6B21\u6570</th>\n        </tr>\n        <tr>\n            <td><span class="usetime">{{report.usetime}}</span></td>\n            <td><span class="rightrate">{{report.rightrate}}</span></td>\n            <td><span class="speed">{{report.speed}}</span>\u5B57/\u5206</td>\n            <td><span class="backnum">{{report.backnum}}</span></td>\n            <td><span class="errornum">{{report.errornum}}</span></td>\n        </tr>\n    </table>\n    <p>\n        <span>\u79D1\u76EE\u7C7B\u522B\uFF1A{{questiontypename}}</span>\n        <span>\u7EC3\u4E60\u8BD5\u5377\uFF1A{{stem}}</span>\n        <span>\u7EC3\u4E60\u65F6\u95F4\uFF1A{{createtime}}</span>\n    </p>\n    <p>\n        <span>\u97F3\u9891\u901F\u5EA6\uFF1A{{speed}}</span>\n    </p>\n    <div class="clearfix btn-box">\n        <a class="btn" :href="answerLink" title="\u67E5\u770B\u7B54\u6848">\u67E5\u770B\u7B54\u6848</a>\n        <a class="btn" :href="reTestLink" title="\u518D\u6B21\u7EC3\u4E60">\u518D\u6B21\u7EC3\u4E60</a>\n        <a class="btn more" :href="moreQuestionLink" title="\u5176\u4ED6\u7EC3\u4E60">\u5176\u4ED6\u7EC3\u4E60</a>\n    </div>\n</div>\n';

//判断登录
if (!checkLogin()) {
  $('#popLayer').show();
  $('.pop-close').hide();
}

//分页
// if(res.extra.totalcount) {
//   $('#recordPage').pagination({
//     length: getrecordCount(), //总条数
//     every: 10, //每页条数
//     onClick: function(){
//       var recordType = $('#recordType .on').attr('data-type')
//       var page = parseInt($('#recordPage span[aria-selected="true"]').text())
//       getrecordlist(recordType, page);
//       $('.record-box').animate({ scrollTop: 0 }, 100)
//     },
//   });
// }


//切换类别
$('#recordType li').click(function () {
  $(this).addClass('on').siblings().removeClass('on');
  $('.ui-page-x').children().eq(1).click();
  getrecordlist($(this).data('type'), '1');
  // 看打160 听打161
  if ($(this).data('type') == '161') {
    $('.page-td').show();
    $('.page-kd').hide();
  } else if ($(this).data('type') == '160') {
    $('.page-td').hide();
    $('.page-kd').show();
  }
});

//报告列表
Vue.component('record-tbody', {
  props: ['record', 'index'],
  data: function data() {
    return {};
  },
  created: function created() {},
  methods: {
    showRecord: function showRecord(recordid) {
      getrecordDetail(recordid);
    }
  },
  template: '<dd class="clearfix">\n    <div>{{record.stem}}</div>\n    <div>{{record.xuekename}}</div>\n    <div v-if="record.questiontypeid == \'161\'">{{record.speed}}</div>\n    <div v-else>-</div>\n    <div>{{record.createtime}}</div>\n    <div><span class="detail-btn" @click="showRecord(record.id)">\u67E5\u770B</span></div>\n  </dd>'
});

var recordList = new Vue({
  el: '#recordList',
  data: {
    records: []
  }
});

//报告弹窗
Vue.component('pop-report', {
  data: function data() {
    return {
      questionid: null,
      createtime: null,
      stem: null,
      xuekeid: null,
      speed: null,
      report: {
        usetime: null,
        rightrate: null,
        backnum: null,
        errornum: null
      },
      usetime: null,
      answer: null,
      id: null,
      questiontypeid: null,
      questiontypename: null,
      xuekename: null,
      answerLink: null,
      reTestLink: null,
      moreQuestionLink: null
    };
  },
  created: function created() {
    var that = this;
    this.infomation.$on('recordDetail', function (data) {
      that.report.usetime = data.report.usetime;
      that.report.rightrate = data.report.rightrate;
      that.report.speed = data.report.speed;
      that.report.backnum = data.report.backnum;
      that.report.errornum = data.report.errornum;
      that.questiontypename = data.questiontypename;
      that.stem = data.stem;
      that.createtime = data.createtime;
      that.speed = data.speed;
      that.answerLink = 'answer.html?xuekeid=' + data.xuekeid + '&reportid=' + data.id + '&qid=' + data.questionid;
      if (data.questiontypeid == '161') {
        that.reTestLink = 'detail-td.html?xuekeid=' + data.xuekeid + '&qid=' + data.questionid;
        that.moreQuestionLink = 'list-td.html?xuekeid=' + data.xuekeid;
      } else {
        that.reTestLink = 'detail-kd.html?xuekeid=' + data.xuekeid + '&qid=' + data.questionid;
        that.moreQuestionLink = 'list-kd.html?xuekeid=' + data.xuekeid;
      }
    });
  },
  methods: {
    closePop: function closePop() {
      $('#popReport').hide();
    }
  },
  template: popReport
});

var recordDetail = new Vue({
  el: '#popReport',
  data: {}
});

getrecordlist('161', '1');

//获取报告列表
function getrecordlist(recordType, page) {

  var sendData = {
    subjectid: subjectid,
    xuekeid: 0,
    questiontype: $('#recordType .on').data('type'),
    page: page ? page : 1,
    perpage: 10,
    timestamp: Date.parse(new Date()) / 1000
  };
  sendData.sign = getSign(sendData);

  var returnRecordlist = [];
  // //请求成功
  // $.ajax({
  //   headers: {
  //     'Authorization':'Bearer '+getCookie('token')
  //   },
  //   url: urlConfig.getrecordlist.url,
  //   method: urlConfig.getrecordlist.method,
  //   data: sendData,
  //   async: false,
  //   dataType: 'json',
  //   success: function (res) {
  //     returnRecordlist = res.data
  //     if(res.extra.totalcount) {
  //       $('#recordPage').pagination({
  //         length: getrecordCount(), //总条数
  //         every: 10, //每页条数
  //         onClick: function(){
  //           var recordType = $('#recordType .on').attr('data-type')
  //           var page = parseInt($('#recordPage span[aria-selected="true"]').text())
  //           getrecordlist(recordType, page);
  //           $('.record-box').animate({ scrollTop: 0 }, 100)
  //         },
  //       });
  //     }

  //   }
  // })
  //请求成功
  $.ajax({
    headers: {
      Authorization: 'Bearer ' + getCookie('token')
    },
    url: urlConfig.getrecordlist.url,
    method: urlConfig.getrecordlist.method,
    data: sendData,
    async: false,
    dataType: 'json',
    success: function success(res) {
      returnRecordlist = res.data;
      console.log('totalcount', res.extra.totalcount);
      //分页
      if (res.extra.totalcount) {
        if (recordType == '161') {
          console.log('recordPage');
          $('#recordPage').pagination({
            length: res.extra.totalcount, //总条数
            every: 10, //每页条数
            onClick: function onClick() {
              var recordType = $('#recordType .on').attr('data-type');
              var page = parseInt($('#recordPage span[aria-selected="true"]').text());
              getrecordlist(recordType, page);
              $('.record-box').animate({ scrollTop: 0 }, 100);
            }
          });
          // setTimeout(function() {
          //   $('#recordPage2').hide()
          //   console.log('延迟执行')
          // }, 50)
        } else if (recordType == '160') {
          $('#recordPage2').pagination({
            length: res.extra.totalcount, //总条数
            every: 10, //每页条数
            onClick: function onClick() {
              var recordType = $('#recordType .on').attr('data-type');
              var page = parseInt($('#recordPage2 span[aria-selected="true"]').text());
              getrecordlist(recordType, page);
              $('.record-box').animate({ scrollTop: 0 }, 100);
            }
          });
          // setTimeout(function() {
          //   $('#recordPage').hide()
          // }, 50)
        }
      }
    }
  });

  recordList.records = returnRecordlist;
  //如果没有练习
  if (recordList.records.length == 0) {
    $('.record-box, .page, .ifnull').hide();
    if (recordType == '161') {
      $('.iftdnull').show();
    } else if (recordType == '160') {
      $('.ifkdnull').show();
    }
  } else {
    $('.ifnull').hide();
    $('.record-box, .page').show();
  }
}

//获取总条数
function getrecordCount() {
  var sendData = {
    subjectid: subjectid,
    xuekeid: 0,
    questiontype: $('#recordType .on').data('type'),
    page: 1,
    perpage: 100000,
    timestamp: Date.parse(new Date()) / 1000
  };
  sendData.sign = getSign(sendData);

  //请求成功
  var returnTotal = '0';
  var resArr = [];
  $.ajax({
    headers: {
      'Authorization': 'Bearer ' + getCookie('token')
    },
    url: urlConfig.getrecordlist.url,
    method: urlConfig.getrecordlist.method,
    data: sendData,
    dataType: 'json',
    async: false,
    success: function success(res) {
      resArr = res.data;
    }
  });
  returnTotal = resArr.length;
  return returnTotal;
}

// 获取报告详情
function getrecordDetail(recordid) {

  var sendData = {
    subjectid: subjectid,
    xuekeid: 0,
    questiontype: $('#recordType .on').eq(0).data('type'),
    id: recordid,
    timestamp: Date.parse(new Date()) / 1000
  };
  sendData.sign = getSign(sendData);

  //显示报告
  $.ajax({
    headers: {
      'Authorization': 'Bearer ' + getCookie('token')
    },
    url: urlConfig.getrecorddetail.url,
    method: urlConfig.getrecorddetail.method,
    data: sendData,
    dataType: 'json',
    async: false,
    success: function success(res) {
      recordDetail.infomation.$emit('recordDetail', res.data);
      $('#popReport').show();
    }
  });
}