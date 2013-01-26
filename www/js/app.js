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

    function createButton(id, x, y, side, maxTime) {
        var btn = document.createElement("button");
        btn.id = id;
        btn.className = "punch";
        btn.setAttribute("style", "width:" + side + "px;" + "height:" + side +
                         "px;" + "top:" + y + "px;" + "left:" + x + "px;");
        return btn;
    }


    var width = window.innerWidth;
    var height = window.innerHeight;
    var r, c, side, rowWidth, rowHeight, blankWidth, blankHeight;

    r = width > height ? 4 : 3;
    c = width > height ? 3 : 4;
    side = Math.ceil(0.25 * (width > height ? height : width));
    rowWidth = side * r;
    rowHeight = side * c;
    blankWidth = (width - rowWidth) / (r + 1);
    blankHeight = (height - rowHeight) / (c + 1);

    var times = [1, 2, 3, 5, 10, 15, 30, 45, 60, 90, 120, 180];
    for (var i=0, k=0; i<c; i++) {
        for (var j=0; j<r; j++) {
            var x = (side * j) + blankWidth * (j + 1)
            var y = (side * i) + blankHeight * (i + 1)
            var time = times[k++] || null;
            var id = idCounter++;

            var maxTime = time ? time * 60 * 1000 : null;

            document.body.appendChild(createButton(id, x, y, side));
            buttons[id] = new Button(id, maxTime);
        }
    }
});
