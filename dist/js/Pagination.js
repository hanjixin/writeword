"use strict";

!function (e, a) {
  "function" == typeof define && (define.amd || define.cmd) ? define(a) : e.Pagination = a();
}(undefined, function () {
  $.fn.pagination = function (a) {
    return $(this).each(function () {
      $(this).data("pagination") || $(this).data("pagination", new e($(this), a));
    });
  };var e = function e(_e, a) {
    _e = _e || $(), a = a || {};var t = this,
        n = { length: 0, current: 1, every: 15, mode: "long", onClick: $.noop },
        i = $.extend({}, n, a),
        r = {};this.el = r, r.container = _e;var s = {};return this.num = s, s.length = i.length, s.current = i.current, s.every = i.every, this.mode = i.mode, this.href = i.href, _e.delegate("a", "click", function (a) {
      var n = $(this).attr("data-page");t.num.current = 1 * n;var r,
          s = this.className;t.show();var o = (r = /prev/.test(s) ? _e.find(".ui-page-prev") : /next/.test(s) ? _e.find(".ui-page-next") : _e.find(".ui-page-current"))[0];o && (o.focus(), !1 === window.isKeyEvent && o.blur()), i.onClick.call(o, t, n), /^javascript/.test(this.href) && a.preventDefault();
    }), this.show(), this;
  },
      a = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><path d="M85.876,100.5l49.537-50.526c4.089-4.215,4.089-11.049,0-15.262 c-4.089-4.218-10.719-4.218-14.808,0L63.586,92.868c-4.089,4.215-4.089,11.049,0,15.264l57.018,58.156 c4.089,4.215,10.719,4.215,14.808,0c4.089-4.215,4.089-11.049,0-15.262L85.876,100.5z"/></svg>';return e.prototype.create = function (e, t) {
    var n = (e = e || {}).length || 0,
        i = e.current || 1,
        r = e.every || 1;t = t || "long";var s = this.href || "javascript:",
        o = function o(e) {
      return "string" == typeof s ? s : "function" == typeof s ? s(e) : void 0;
    },
        l = "ui-page",
        c = Math.ceil(n / r) || 1,
        h = "",
        p = [l, "ui-page-prev"].join(" "),
        u = [l, "ui-page-next"].join(" "),
        f = [l, "ui-page-ellipsis"].join(" "),
        g = [l, "ui-page-text"].join(" "),
        v = [l, "ui-page-current"].join(" ");if (h = i > 1 ? h + '<a href="' + o(i - 1) + '" class="' + p + '" data-page="' + (i - 1) + '" aria-label="上一页，当前第' + i + '页">' + a + "</a>" : h + '<span class="' + p + '">' + a + "</span>", "long" == t) {
      var d = function d(e) {
        h = e == i ? h + '<span class="' + v + '" aria-label="第' + e + "页，共" + c + '页" aria-selected="true" role="option">' + e + "</span>" : h + '<a href="' + o(e) + '" class="' + l + '" data-page="' + e + '" aria-label="第' + e + "页，共" + c + '页">' + e + "</a>";
      };if (c <= 6) for (var m = 1; m <= c; m++) {
        d(m);
      } else if (i < .5 * c && i < 5) {
        if (i < 5) for (m = 1; m < 6; m++) {
          d(m);
        }h = h + '<span class="' + f + '">...</span>', d(c);
      } else if (i > .5 * c && i > c - 6 + 2) for (d(1), h = h + '<span class="' + f + '">...</span>', m = c - 6 + 2; m <= c; m++) {
        d(m);
      } else d(1), h = h + '<span class="' + f + '">...</span>', d(i - 1), d(i), d(i + 1), h = h + '<span class="' + f + '">...</span>', d(c);
    } else "short" == t && (h = h + '<span class="' + g + '" aria-label="第' + i + "页，共" + c + '页" role="option">' + [i, c].join("/") + "</span>");return '<div class="ui-page-x">' + (h = i < c ? h + '<a href="' + o(i + 1) + '" class="' + u + '" data-page="' + (i + 1) + '" aria-label="下一页，当前第' + i + '页">' + a + "</a>" : h + '<span class="' + u + '">' + a + "</span>") + "</div>";
  }, e.prototype.show = function () {
    var e = this.num;e.length = Math.max(e.length, 0), e.every = Math.max(e.every, 1);var a = Math.ceil(e.length / e.every);return e.current > a && (e.current = a), e.current = Math.max(e.current, 1), this.el && this.el.container && this.el.container.size() && this.el.container.html(this.create(e, this.mode)), this;
  }, e;
});