'use strict';
// 判断登录
if (!checkLogin()) {
  $('#popLayer').show();
  $('.pop-close').hide();
}
//左侧学科类别
Vue.component('left-nav', {
  props: ['xueke', 'xuekeId', 'index'],
  data: function () {
    return {
      iconClass: '',
      isActive: false,
      listLink: '',
    };
  },
  created: function () {
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
  template: `
  <a :title="xueke.xueke" 
  :class="{on:isActive}"
  :data-xuekeId="xueke.id" 
  :href="listLink"
  ><i :class="iconClass"></i>{{xueke.xueke}}</a>
  `,
});
if ($('#leftNav').length > 0) {
  new Vue({
    el: '#leftNav',
    data: {
      xuekes: [],
    },
    created: function () {
      this.xuekes = getxuekelist('1');
    },
    methods: {},
  });
}

//答案详情
Vue.component('kddetail', {
  props: ['json_answer', 'index'],
  data: function () {
    return {
      nameIndex: '',
      inputMessage: '',
      deleteCount: 0,
      answer: null,
      questionid: null,
      questiontype: null,
    };
  },
  created: function () {
    this.nameIndex = 'inputarr' + this.index;
    this.inputMessage = '';

    var message = this.json_answer.stem;
    var inputMessage = this.json_answer.answer;
    var messageArr = message.split('');
    var messageLength = 0;

    for (var i = 0; i < inputMessage.length; i++) {
      if (message[i] == inputMessage[i]) {
        messageArr[i] = '<span class="right">' + message[i] + '</span>';
      } else {
        messageArr[i] = '<span class="error">' + message[i] + '</span>';
      }
    }
    this.json_answer.stem = messageArr.join('');
  },
  template: `
    <li :index="index">
    <p :p-identify="index" v-html="json_answer.stem"></p>
    <input type="text" class="in-text" disabled
        :name="nameIndex"
        v-model="json_answer.answer"
    >
    </li>`,
});

new Vue({
  el: '#kddetail',
  data: {
    stem: null,
    answers: null,
  },
  created: function () {
    var jsonData;
    var questionData;

    var sendQuestionData = {
      subjectid: subjectid,
      xuekeid: getQueryVariable('xuekeid'),
      questionid: getQueryVariable('qid'),
      timestamp: Date.parse(new Date()) / 1000,
    };
    sendQuestionData.sign = getSign(sendQuestionData);

    //请求成功
    $.ajax({
      url: urlConfig.getquestiondetail.url,
      method: urlConfig.getquestiondetail.method,
      data: sendQuestionData,
      dataType: 'json',
      async: false,
      success: function (res) {
        questionData = res.data;
        var htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = questionData.answer;
        questionData.answer = htmlDiv.innerText;
      },
    });

    var sendData = {
      subjectid: subjectid,
      xuekeid: getQueryVariable('xuekeid'),
      id: getQueryVariable('reportid'),
      questiontype: questionData.id,
      timestamp: Date.parse(new Date()) / 1000,
    };
    sendData.sign = getSign(sendData);

    $.ajax({
      headers: {
        Authorization: 'Bearer ' + getCookie('token'),
      },
      url: urlConfig.getrecorddetail.url,
      method: urlConfig.getrecorddetail.method,
      data: sendData,
      dataType: 'json',
      async: false,
      success: function (res) {
        jsonData = res.data;
        console.log(jsonData.answer);
        var htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = jsonData.answer;
        jsonData.answer = htmlDiv.innerText;
      },
    });

    this.stem = jsonData.stem;
    this.speed = jsonData.report.speed;
    this.usetime = jsonData.report.usetime;
    this.backnum = jsonData.report.backnum;
    this.questiontypeid = jsonData.questiontypeid;
    this.questionid = jsonData.questionid;
    this.xuekeid = jsonData.xuekeid;
    this.answers = [];

    if (this.questiontypeid == '161') {
      jsonData.answer = jsonData.answer.replace(
        /([^0-9|^a-z|^A-Z|^\u4e00-\u9fa5])*/g,
        ''
      );
      questionData.answer = questionData.answer.replace(
        /([^0-9|^a-z|^A-Z|^\u4e00-\u9fa5])*/g,
        ''
      );
    }
    var tmpLeng = questionData.answer.length;
    var limitLeng = 56;

    console.log(jsonData, jsonData.stem_arr);
    for (var i = 0; i < Math.ceil(tmpLeng / limitLeng); i++) {
      var tmp = {
        stem: questionData.answer.substr(i * limitLeng, limitLeng),
        answer: jsonData.stem_arr[0].substr(i * limitLeng, limitLeng),
      };
      this.answers.push(tmp);
    }
    $('#kddetail').show();
  },
  methods: {
    reDo: function () {
      if (this.questiontypeid == 160) {
        location.href =
          'detail-kd.html?xuekeid=' + this.xuekeid + '&qid=' + this.questionid;
      } else if (this.questiontypeid == 161) {
        location.href =
          'detail-td.html?xuekeid=' + this.xuekeid + '&qid=' + this.questionid;
      }
    },
  },
});
