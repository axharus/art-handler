class ArtHandler {
    constructor() {
        this.endTime = 0;
        this.count = 0;
        this.startTime = new Date();
        this.speed_breakpoint = 14000;
        this.speed_js_trashhole = 9;
        this.speed_server_trashhole = 3;
        this.handle_url = '/arthandler/receive';

        if(window.arthandlerurl){
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


    error_handler(content, status, type = 'js', time=false) {
        let info = {
            error: content.substring(0, 1000),
            path: window.location.href,
            screen: window.innerWidth + "x" + window.innerHeight,
            scroll: window.pageYOffset,
            timer: this.end(),
            status_code: status ?? 500,
            type: type
        };
        if (time){
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
        if(window.arthandlerurl){

        }
        this.ajax_get(this.handle_url, info, function (a) {
            if (window.artdebug && window.artdebug === true) {
                console.log('Response: ', a);
            }
        });
    };

    measure_speed_server(){
        let server_speed = window.artloadingtime;
        let status_code = 299;
        let error_content = "Speed too low Error \n";



        if(server_speed > this.speed_server_trashhole){
            if (this.count >= 10) {
                return false;
            }
            this.count++;

            error_content += "SERVER Load Time: " + server_speed + "\n";
            this.error_handler(error_content, status_code, 'speed_server', server_speed);
        }

    }


    measure_speed_js() {
        let js_speed = 999;

        let status_code = 299;
        let error_content = "Speed too low Error \n";
        try {
            js_speed =  ((performance.now() - this.time_start)/1000).toFixed(2);
        } catch (e) {
            console.log('Performance error');
        }

        if(js_speed > this.speed_js_trashhole){
            if (this.count >= 10) {
                return false;
            }
            this.count++;

            error_content += "JS Load Time: " + js_speed + "\n";
            this.error_handler(error_content, status_code, 'speed_js', js_speed);
        }
    }


    jsRunner() {
        let $this = this;
        window.addEventListener('error', function (e) {
            if (this.count >= 10) {
                return false;
            }
            this.count++;
            let status_code = 500;


            let error_content = "JS Error \n";
            if (e.error) {
                error_content += "Message: " + e.error.message + "\n";
                error_content += "Stacktrace: " + e.error.stack + "\n";
            } else if (e.target) {
                error_content += "Error with element: " + e.target.outerHTML + "\n";
                status_code = 404;
            } else {
                error_content += "Some unexpect error: " + JSON.stringify(temp1) + "\n"
            }
            $this.error_handler(error_content, status_code);
        }, true);
    }

    xhrRunner() {
        let $this = this;
        this.addXMLRequestCallback(function (xhrquest) {
            let parent = xhrquest.onreadystatechange;
            xhrquest.onreadystatechange = function (oEvent) {
                if (parent) {
                    parent(oEvent);
                }
                if (xhrquest.readyState === 4 && xhrquest.status !== 200) {

                    if (this.count >= 10) {
                        return false;
                    }
                    this.count++;

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
                    $this.error_handler(error_content, status_code);
                }
            };
        });
    }

    onLoadRunner() {
        let $this = this;
        let sent = false;
        setTimeout(()=>{
            if(!sent){
                $this.measure_speed_js();
            }
            sent = true;
        }, this.speed_breakpoint);
        window.addEventListener('load', (event) => {
            if(!sent){
                $this.measure_speed_js();
            }
            sent = true;
        });
    }

    addXMLRequestCallback(callback) {
        let oldSend, i;
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


    ajax_x() {
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

    ajax_send(url, callback, method, data, async) {
        if (async === undefined) {
            async = true;
        }
        let x = this.ajax_x();
        x.open(method, url, async);
        x.onreadystatechange = function () {
            if (x.readyState === 4) {
                callback(x.responseText)
            }
        };
        if (method === 'POST') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
    };

    ajax_get(url, data, callback, async) {
        let query = [];
        for (let key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        this.ajax_send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
    };


    end() {
        this.endTime = new Date();
        let timeDiff = this.endTime - this.startTime;
        timeDiff /= 1000;
        return Math.round(timeDiff);
    };
}


(function () {

    try {
        window.artHandler = new ArtHandler();
    } catch (e) {
        console.log('Something wrong with debuger', e);
    }
})();



