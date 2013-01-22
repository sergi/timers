"use strict";

var alarmSound = new Audio("alarm.ogg");
alarmSound.loop = true;

function padLeft(string,pad,length){
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function formatTime(time) {
    var hrs = ~~ (time / 3600);
    var mins = ~~ ((time % 3600) / 60);
    var secs = time % 60;
    var hoursText = hrs === 0 ? "" : hrs + ":";

    return hoursText + padLeft(mins, '0', 2) + ":" + padLeft(secs, '0', 2);
}

define(function(require) {
    var Button = function(maxTime) {
        this.maxTime = maxTime;
    };

    Button.prototype = {
        start: function() {
            var self = this;
            this.startTime = Date.now();
            this.timer = setInterval(function() {
                var passed = Date.now() - self.startTime;
                if (passed > self.maxTime) {
                    clearInterval(self.timer);
                    self.alarm();
                } else {
                    var left = self.maxTime - passed
                    self.update(Math.floor(left / 1000));
                }
            }, 100);

            this.running = true;
        },

        alarm: function() {
            alarmSound.play();
            this.btn.className = this.btn.className + " red";
            var text = this.btn.textContent;
            var self = this;
            this.blinking = setInterval(function() {
                self.btn.textContent = self.btn.textContent === "" ? text : "";
            }, 500);
        },

        update: function(passed) {
            if (this.btn) {
                this.btn.textContent = formatTime(passed);
            }
        },

        reset: function(val) {
            clearInterval(this.timer);
            clearInterval(this.blinking);
            if (val != undefined && this.btn) {
                this.btn.textContent = formatTime(val);
            }
            this.running = false;
            alarmSound.pause(); // FIXME Will stop all alarms
            this.btn.className = this.btn.className.replace("red", "");
        },

        render: function roundRect(x, y, width) {
            var btn = this.btn = document.createElement("button");
            btn.setAttribute("class", "punch")
            btn.setAttribute("style", "width:" + width + "px;height:" + width + "px;" +
                             "top:" + y + "px;left:" + x + "px;");

            if (this.maxTime) {
                this.btn.textContent = formatTime(this.maxTime / 1000);
            }
            else {
            }

            var self = this;
            btn.addEventListener("click", self.onTap.bind(self));

            document.body.appendChild(btn)
            return btn;
        },

        onTap: function() {
            if (this.running === true) {
                this.reset(this.maxTime / 1000);
            }
            else {
                if (this.maxTime) {
                    this.start();
                }
                else {

                }
            }
        }
    }
    return Button;
});
