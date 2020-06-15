"use strict";
try {
    let startTime, endTime, error_handler;
    let count = 0;
    (() => {
        startTime = new Date();
    })();
    let addXMLRequestCallback = (callback) => {
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
            }
        }
    };

    addXMLRequestCallback(function (xhrquest) {
        let parent = xhrquest.onreadystatechange;
        xhrquest.onreadystatechange = function (oEvent) {
            if (parent) {
                parent(oEvent);
            }
            if (xhrquest.readyState === 4 && xhrquest.status !== 200) {

                if (count >= 10) {
                    return false;
                }
                count++;

                let error_content = "XHR Error \n";
                let status_code = 404;
                if (xhrquest.status === 0) {
                    error_content += "Error status is undefined \n";
                    error_content += "It can be AdBlock \n";
                } else {
                    error_content += "Status code: " + xhrquest.status + "\n";
                    error_content += "Status text: " + xhrquest.statusText + "\n";
                    error_content += "Response: " + xhrquest.response + "\n";
                    status_code = xhrquest.status ? xhrquest.status : 404;
                }
                error_handler(error_content, status_code);
            }
        };
    });


    window.addEventListener('error', function (e) {
        if (count >= 10) {
            return false;
        }
        count++;


        let error_content = "JS Error \n";
        if (e.error) {
            error_content += "Message: " + e.error.message + "\n";
            error_content += "Stacktrace: " + e.error.stack + "\n";
        } else if (e.target) {
            error_content += "Error with element: " + e.target.outerHTML + "\n";
        } else {
            error_content += "Some unexpect error: " + JSON.stringify(temp1) + "\n"
        }
        error_handler(error_content, 500);
    }, true);

    error_handler = function (content, status) {
        let info = {
            error: content.substring(0,1000),
            path: window.location.href,
            screen: window.innerWidth + "x" + window.innerHeight,
            scroll: window.pageYOffset,
            timer: end(),
            status_code: status ?? 500
        };
        if(window.artpreventor && window.artpreventor.includes(info.status_code)){
            if (window.artdebug && window.artdebug === true) {
                console.log('Sending prevented: ',info);
            }
            return false;
        }
        if (window.artdebug && window.artdebug === true) {
            console.log('Content before sending: ',info);
        }
        ajax.get('/arthandler/receive', info, function (a) {
            if (window.artdebug && window.artdebug === true) {
                console.log('Response: ',a);
            }
        });
    };


    let ajax = {};
    ajax.x = function () {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        let versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];

        let xhr;
        for (let i = 0; i < versions.length; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {
            }
        }
        return xhr;
    };

    ajax.send = function (url, callback, method, data, async) {
        if (async === undefined) {
            async = true;
        }
        let x = ajax.x();
        x.open(method, url, async);
        x.onreadystatechange = function () {
            if (x.readyState == 4) {
                callback(x.responseText)
            }
        };
        if (method == 'POST') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
    };

    ajax.get = function (url, data, callback, async) {
        let query = [];
        for (let key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
    };


    let end = () => {
        endTime = new Date();
        let timeDiff = endTime - startTime;
        timeDiff /= 1000;
        return Math.round(timeDiff);
    };
} catch (e) {
    console.log('Something wrong with debuger', e);
}
