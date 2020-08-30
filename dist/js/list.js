'use strict';
//左侧学科类别

Vue.component('left-nav', {
  props: ['xueke', 'xuekeid', 'index'],
  data: function data() {
    return {
      iconClass: ''
    };
  },
  created: function created() {
    this.iconClass = 'icon10' + this.index;
  },
  methods: {
    showList: function showList() {
      $(event.srcElement).addClass('on').siblings().removeClass('on');
      var list = getquestionlist();
      this.infomation.$emit('change-list', { 'list': list });
    }
  },
  template: '\n  <span :title="xueke.xueke" \n  :class="{on:index==1}"\n  :data-xuekeid="xueke.id" \n  @click="showList()"\n  ><i :class="iconClass"></i>{{xueke.xueke}}</span>\n  '
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

//打字速度类别
Vue.component('speed-nav', {
  props: ['speed', 'index'],
  data: function data() {
    return {};
  },
  created: function created() {},
  methods: {
    showList: function showList() {
      $(event.srcElement).addClass('on').siblings().removeClass('on');
      var list = getquestionlist();
      this.infomation.$emit('change-list', { 'list': list });
    }
  },
  template: '<li :data-speed="speed.id"\n    :class="{on:index==0}"\n    @click="showList()"\n   >{{speed.name}}</li>'
});
if ($('#speedDiv').length > 0) {
  new Vue({
    el: '#speedDiv',
    data: {
      speeds: []
    },
    created: function created() {
      this.speeds = getxuekelist('3');
    },
    methods: {}
  });
}

//试题列表
Vue.component('question-list', {
  props: ['list', 'index'],
  data: function data() {
    return {
      questiontype: '',
      xuekeid: $('#leftNav .on').eq(0).data('xuekeid'),
      detaillink: ''
    };
  },
  created: function created() {
    this.questiontype = globalcrrentListType;
    if (this.questiontype == '160') {
      this.detaillink = 'detail-kd.html';
    } else {
      this.detaillink = 'detail-td.html';
    }
    this.xuekeid = $('#leftNav .on').eq(0).data('xuekeid');
    this.detaillink = this.detaillink + '?xuekeid=' + this.xuekeid + '&qid=';
  },
  methods: {},
  template: '<li>\n  <a :href="detaillink+list.id" :title="list.stem" class="imgbox"><img :src="list.img" alt=""></a>\n  <p><a :href="detaillink+list.id" :title="list.stem">{{list.stem}}</a></p>\n  <div class="time">\u66F4\u65B0\u65F6\u95F4\uFF1A{{list.updatedTime}}</div>\n</li>'
});
if ($('#list').length > 0) {
  new Vue({
    el: '#list',
    data: {
      lists: []
    },
    created: function created() {
      var that = this;
      this.lists = getquestionlist();
      //接收列表信息
      this.infomation.$on('change-list', function (data) {
        that.lists = data.list;
      });
    },
    methods: {}
  });
}

//带参数初始化
$(function () {
  if (getQueryVariable('xuekeid')) {
    $('#leftNav span[data-xuekeid="' + getQueryVariable('xuekeid') + '"]').click();
  }
  if (getQueryVariable('speed')) {
    $('#speedDiv li[data-speed="' + getQueryVariable('speed') + '"]').click();
  }
});

//获取试题列表
function getquestionlist() {
  var returnArr = [];
  var sendData = {
    subjectid: subjectid,
    page: '1',
    speed: $('#speedDiv li[class="on"]').attr('data-speed') ? $('#speedDiv li[class="on"]').attr('data-speed') : '',
    perpage: '1000000000',
    timestamp: Date.parse(new Date()) / 1000
  };
  if ($('#leftNav span[class="on"]').attr('data-xuekeid')) {
    sendData.xuekeid = $('#leftNav span[class="on"]').attr('data-xuekeid');
  }
  if (globalcrrentListType) {
    sendData.questiontype = globalcrrentListType;
  }

  sendData.sign = getSign(sendData);

  //请求成功
  $.ajax({
    url: urlConfig.getquestionlist.url,
    method: urlConfig.getquestionlist.method,
    async: false,
    data: sendData,
    dataType: 'json',
    success: function success(res) {
      $('.list-box').animate({ scrollTop: 0 }, 100);
      returnArr = res.data;
    }
  });
  return returnArr;
}
