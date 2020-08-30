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
        <a class="btn" :href="reTestLink" title="再次练习">再次练习</a>
        <a class="btn more" :href="moreQuestionLink" title="其他练习">其他练习</a>
    </div>
</div>
`;

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
  if($(this).data('type') == '161') {
    $('.page-td').show()
    $('.page-kd').hide() 
  } else if ($(this).data('type') == '160') {
    $('.page-td').hide()
    $('.page-kd').show() 

  }
});

//报告列表
Vue.component('record-tbody', {
  props: ['record', 'index'],
  data: function () {
    return {
    }
  },
  created: function () {

  },
  methods: {
    showRecord: function (recordid) {
      getrecordDetail(recordid);
    },
  },
  template: `<dd class="clearfix">
    <div>{{record.stem}}</div>
    <div>{{record.xuekename}}</div>
    <div v-if="record.questiontypeid == '161'">{{record.speed}}</div>
    <div v-else>-</div>
    <div>{{record.createtime}}</div>
    <div><span class="detail-btn" @click="showRecord(record.id)">查看</span></div>
  </dd>`
})

var recordList = new Vue({
  el: '#recordList',
  data: {
    records: [],
  },
})


//报告弹窗
Vue.component('pop-report', {
  data: function () {
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
      moreQuestionLink: null,
    }
  },
  created: function () {
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
      that.answerLink = 'answer.html?xuekeid='+data.xuekeid+'&reportid=' + data.id+'&qid='+data.questionid;
      if (data.questiontypeid == '161') {
        that.reTestLink = 'detail-td.html?xuekeid='+data.xuekeid+'&qid='+data.questionid;
        that.moreQuestionLink = 'list-td.html?xuekeid='+data.xuekeid;
      } else {
        that.reTestLink = 'detail-kd.html?xuekeid='+data.xuekeid+'&qid='+data.questionid;
        that.moreQuestionLink = 'list-kd.html?xuekeid='+data.xuekeid;
      }
    });

  },
  methods: {
    closePop: function () {
      $('#popReport').hide();
    }
  },
  template: popReport
})

var recordDetail = new Vue({
  el: '#popReport',
  data: {
  },
})

getrecordlist('161', '1')

//获取报告列表
function getrecordlist(recordType, page) {

  var sendData = {
    subjectid: subjectid,
    xuekeid: 0,
    questiontype: $('#recordType .on').data('type'),
    page: page ? page : 1,
    perpage: 10,
    timestamp: Date.parse(new Date()) / 1000
  }
  sendData.sign = getSign(sendData);

  var returnRecordlist =[];
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
      Authorization: 'Bearer ' + getCookie('token'),
    },
    url: urlConfig.getrecordlist.url,
    method: urlConfig.getrecordlist.method,
    data: sendData,
    async: false,
    dataType: 'json',
    success: function (res) {
      returnRecordlist = res.data;
      console.log('totalcount', res.extra.totalcount);
      //分页
      if (res.extra.totalcount) {
        if(recordType == '161') {
          console.log('recordPage')
          $('#recordPage').pagination({
            length: res.extra.totalcount, //总条数
            every: 10, //每页条数
            onClick: function () {
              var recordType = $('#recordType .on').attr('data-type');
              var page = parseInt(
                $('#recordPage span[aria-selected="true"]').text()
                );
              getrecordlist(recordType, page);
              $('.record-box').animate({ scrollTop: 0 }, 100);
            },
          });
          // setTimeout(function() {
          //   $('#recordPage2').hide()
          //   console.log('延迟执行')
          // }, 50)
        } else if (recordType == '160') {
          $('#recordPage2').pagination({
            length: res.extra.totalcount, //总条数
            every: 10, //每页条数
            onClick: function () {
              var recordType = $('#recordType .on').attr('data-type');
              var page = parseInt(
                $('#recordPage2 span[aria-selected="true"]').text()
              );
              getrecordlist(recordType, page);
              $('.record-box').animate({ scrollTop: 0 }, 100);
            },
          });
          // setTimeout(function() {
          //   $('#recordPage').hide()
          // }, 50)

        }
        
        
      }
    },
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
  }
  sendData.sign = getSign(sendData);

  //请求成功
  var returnTotal ='0'
  var resArr = [];
  $.ajax({
    headers: {
      'Authorization':'Bearer '+getCookie('token')
    },
    url: urlConfig.getrecordlist.url,
    method: urlConfig.getrecordlist.method,
    data: sendData,
    dataType: 'json',
    async: false,
    success: function (res) {
      resArr = res.data;
    }
  })
  returnTotal = resArr.length
  return returnTotal
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
      'Authorization':'Bearer '+getCookie('token')
    },
    url: urlConfig.getrecorddetail.url,
    method: urlConfig.getrecorddetail.method,
    data: sendData,
    dataType: 'json',
    async: false,
    success: function (res) {
      recordDetail.infomation.$emit('recordDetail', res.data);
      $('#popReport').show();
    }
  })
}