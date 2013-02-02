"use strict";

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

function setBtnCaption(id, val) {
    val = formatTime(val);
    return document.getElementById(id).textContent = val;
}

function setBtnClass(id, val) {
    return document.getElementById(id).classname = val;
}

define(function(require) {
    var Button = function(id, maxTime) {
        this.id = id;

        if (maxTime) {
            this.maxTime = maxTime;
            this.caption = maxTime / 1000;
        } else {
            this.settable = true;
        }
    };

    Button.prototype = {
        set caption(value) {
            this._caption = setBtnCaption(this.id, value);
        },

        get caption() {
            return this._caption;
        },

        start: function() {
            this.startTime = Date.now();
            this.running = true;
        },

        alarm: function() {
            setBtnClass(this.id, "punch red");
        },

        reset: function(val) {
            this.caption = val;
            if (this.settable) {
                this.caption = "";
                this.maxTime = null;
            }

            this.running = false;
            setBtnClass(this.id, "punch");
        },

        onTap: function() {
            if (this.running === true) {
                this.reset(this.maxTime / 1000);
            }
            else if (this.maxTime) {
                this.start();
            }
        }
    }
    return Button;
});
