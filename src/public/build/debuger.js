"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ArtHandler = /*#__PURE__*/function () {
  function ArtHandler() {
    _classCallCheck(this, ArtHandler);

    this.endTime = 0;
    this.count = 0;
    this.startTime = new Date();
    this.speed_breakpoint = 14000;
    this.speed_js_trashhole = 9;
    this.speed_server_trashhole = 3;
    this.handle_url = '/arthandler/receive';

    if (window.arthandlerurl) {
      this.handle_url = window.arthandlerurl;
    }

    this.time_start = 0;

    try {
      this.time_start = performance.now();
    } catch (e) {
      console.log('Performance does not exist');
    }

    this.xhrRunner();
    this.jsRunner();
    this.onLoadRunner();
    this.measure_speed_server();
  }

  _createClass(ArtHandler, [{
    key: "error_handler",
    value: function error_handler(content, status) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'js';
      var time = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (this.count >= 10) {
        console.log('ArtHandler: error prevented because of  > 10');

        if (this.count === 400) {
          this.error_handler("Error amount on page bigger than 400, something wrong with browser \n", 298);
        }

        this.count++;
        return false;
      }

      this.count++;
      var info = {
        error: content.substring(0, 1000),
        path: window.location.href,
        screen: window.innerWidth + "x" + window.innerHeight,
        scroll: window.pageYOffset,
        timer: this.end(),
        status_code: status !== null && status !== void 0 ? status : 500,
        type: type
      };

      if (time) {
        info.time = time;
      }

      if (window.artpreventor && window.artpreventor.includes(info.status_code)) {
        if (window.artdebug && window.artdebug === true) {
          console.log('Sending prevented: ', info);
        }

        return false;
      }

      if (window.artdebug && window.artdebug === true) {
        console.log('Content before sending: ', info);
      }

      if (window.arthandlerurl) {}

      this.ajax_get(this.handle_url, info, function (a) {
        if (window.artdebug && window.artdebug === true) {
          console.log('Response: ', a);
        }
      });
    }
  }, {
    key: "measure_speed_server",
    value: function measure_speed_server() {
      var server_speed = window.artloadingtime;
      var status_code = 299;
      var error_content = "Speed too low Error \n";

      if (server_speed > this.speed_server_trashhole) {
        error_content += "SERVER Load Time: " + server_speed + "\n";
        this.error_handler(error_content, status_code, 'speed_server', server_speed);
      }
    }
  }, {
    key: "measure_speed_js",
    value: function measure_speed_js() {
      var js_speed = 999;
      var status_code = 299;
      var error_content = "Speed too low Error \n";

      try {
        js_speed = ((performance.now() - this.time_start) / 1000).toFixed(2);
      } catch (e) {
        console.log('Performance error');
      }

      if (js_speed > this.speed_js_trashhole) {
        error_content += "JS Load Time: " + js_speed + "\n";
        this.error_handler(error_content, status_code, 'speed_js', js_speed);
      }
    }
  }, {
    key: "jsRunner",
    value: function jsRunner() {
      var $this = this;
      window.addEventListener('error', function (e) {
        var status_code = 500;
        var error_content = "JS Error \n";

        if (e.error) {
          error_content += "Message: " + e.error.message + "\n";
          error_content += "Stacktrace: " + e.error.stack + "\n";
        } else if (e.target) {
          error_content += "Error with element: " + e.target.outerHTML + "\n";
          status_code = 404;
        } else {
          error_content += "Some unexpect error: " + JSON.stringify(temp1) + "\n";
        }

        $this.error_handler(error_content, status_code);
      }, true);
    }
  }, {
    key: "xhrRunner",
    value: function xhrRunner() {
      var $this = this;
      this.addXMLRequestCallback(function (xhrquest) {
        var parent = xhrquest.onreadystatechange;

        xhrquest.onreadystatechange = function (oEvent) {
          if (parent) {
            parent(oEvent);
          }

          if (xhrquest.readyState === 4 && xhrquest.status !== 200) {
            var error_content = "XHR Error \n";
            var status_code = 404;

            if (xhrquest.status === 0) {
              error_content += "Error status is undefined \n";
              error_content += "It can be AdBlock \n";
            } else {
              error_content += "Status code: " + xhrquest.status + "\n";
              error_content += "Status text: " + xhrquest.statusText + "\n";
              error_content += "Response: " + xhrquest.response + "\n";
              status_code = xhrquest.status ? xhrquest.status : 404;
            }

            $this.error_handler(error_content, status_code);
          }
        };
      });
    }
  }, {
    key: "onLoadRunner",
    value: function onLoadRunner() {
      var $this = this;
      var sent = false;
      setTimeout(function () {
        if (!sent) {
          $this.measure_speed_js();
        }

        sent = true;
      }, this.speed_breakpoint);
      window.addEventListener('load', function (event) {
        if (!sent) {
          $this.measure_speed_js();
        }

        sent = true;
      });
    }
  }, {
    key: "addXMLRequestCallback",
    value: function addXMLRequestCallback(callback) {
      var oldSend, i;

      if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
      } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.send = function () {
          for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
            XMLHttpRequest.callbacks[i](this);
          }

          oldSend.apply(this, arguments);
        };
      }
    }
  }, {
    key: "ajax_x",
    value: function ajax_x() {
      if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
      }

      var versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
      var xhr;

      for (var i = 0; i < versions.length; i++) {
        try {
          xhr = new ActiveXObject(versions[i]);
          break;
        } catch (e) {}
      }

      return xhr;
    }
  }, {
    key: "ajax_send",
    value: function ajax_send(url, callback, method, data, async) {
      if (async === undefined) {
        async = true;
      }

      var x = this.ajax_x();
      x.open(method, url, async);

      x.onreadystatechange = function () {
        if (x.readyState === 4) {
          callback(x.responseText);
        }
      };

      if (method === 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }

      x.send(data);
    }
  }, {
    key: "ajax_get",
    value: function ajax_get(url, data, callback, async) {
      var query = [];

      for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }

      this.ajax_send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
    }
  }, {
    key: "end",
    value: function end() {
      this.endTime = new Date();
      var timeDiff = this.endTime - this.startTime;
      timeDiff /= 1000;
      return Math.round(timeDiff);
    }
  }]);

  return ArtHandler;
}();

(function () {
  try {
    window.artHandler = new ArtHandler();
  } catch (e) {
    console.log('Something wrong with debuger', e);
  }
})();