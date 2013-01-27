"use strict"

define(function(require) {
    require('receiptverifier');
    var Button = require('./button');

    var alarmSound = new Audio("alarm.wav");
    alarmSound.loop = true;

    var idCounter = 0;
    var buttons = {};
    var loop;

    function _loop() {
        for (var i in buttons) {
            var btn = buttons[i];
            if (!btn.running) continue;

            var passed = Date.now() - btn.startTime;
            if (passed > btn.maxTime) {
                alarmSound.play();
                // Stop alarm after 2 mins. Regardless.
                // setTimeout(alarmSound.pause, 120000);
                delete buttons[i];
            } else {
                var left = btn.maxTime - passed;
                btn.caption = Math.floor(left / 1000);
            }
        }
    }

    document.body.addEventListener("click", onClick);
    function onClick(e) {
        var el = e.target;
        if (el.className.indexOf("punch") > -1) {

            var btn = buttons[el.getAttribute("id")];
            if (btn.running === true) {
                btn.reset(btn.maxTime / 1000);
                for (var i in buttons) {
                    if (buttons[i].running) {
                        return;
                    }
                }
                alarmSound.pause();
                clearInterval(loop);
                loop = null;
            }
            else if (btn.maxTime) {
                btn.start();
                if (!loop) {
                    loop = setInterval(_loop, 100);
                }
            }
        }
    }

    var btns = document.body.getElementsByTagName("button");
    for(var i=0; i<btns.length; i++) {
        var id = btns[i].id;
        var maxTime = parseInt(btns[i].getAttribute("data-time")) * 60 * 1000;
        buttons[id] = new Button(id, maxTime)
    }

});
