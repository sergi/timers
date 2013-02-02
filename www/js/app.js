"use strict"

define(function(require) {
  require('receiptverifier');

  // Installation button
  require('./install-button');

  // Install the layouts
  require('layouts/layouts');

  var Button = require('./button');

  var alarmSound = new Audio("alarm.wav");
  alarmSound.loop = true;

  var cVal = "";
  var selectedBtn = "";
  screen.mozLockOrientation("portrait");
  $(".config").css("display", "none");
  $(".num").click(function() {
    var $this = $(this)
    if (cVal.length < 5) cVal += $this.text();
    console.log(cVal)
    var final = ""
    for (var i = 1; i <= 5 - cVal.length; i++) {
      final += "0";
    }
    final += cVal
    final = final[0] + ":" + final[1] + final[2] + ":" + final[3] + final[4];

    $("#time-label").text(final);
  });

  $("#cancel_config").click(function() {
    showScreen("home");
    cVal = "";
    $("#time-label").text("0:00:00");
  });

  $("#set_config").click(function() {
    showScreen("home");
    cVal = "";
    var t = $("#time-label").text();
    var val = (t[0] * 60) + (parseInt(t[2] + t[3]))
    var btnEl = document.getElementById(selectedBtn);
    btnEl.setAttribute("data-time", val)
    btnEl.textContent = $("#time-label").text();
    var btn = buttons[btnEl.getAttribute("id")];
    btn.maxTime = parseInt(val) * 60 * 1000;

    $("#time-label").text("0:00:00");
    $("#" + selectedBtn).click();
  });

  var idCounter = 0;
  var buttons = {};
  var loop;

  function _loop() {
    for (var i in buttons) {
      var btn = buttons[i];
      if (!btn.running) continue;

      var passed = Date.now() - btn.startTime;
      if (passed > btn.maxTime) {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 200, 200, 200, 200]);
        }

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

  function showScreen(screen) {
    $(".home").css("display", "none");
    $(".config").css("display", "none");
    $("." + screen).css("display", "block");
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
      } else if (btn.settable && (!el.getAttribute("data-time"))) {
        showScreen("config");
        selectedBtn = e.target.getAttribute("id");
      } else if (btn.maxTime) {
        btn.start();
        if (!loop) {
          loop = setInterval(_loop, 100);
        }
      }
    }
  }

  var btns = document.body.getElementsByTagName("button");
  for (var i = 0; i < btns.length; i++) {
    var id = btns[i].id;
    var settable = btns[i].getAttribute("data-settable");
    var mTime = null;
    if (!settable) {
      var _maxTime = btns[i].getAttribute("data-time");
      mTime = parseInt(_maxTime, 10) * 60 * 1000;
    }
    console.log(settable, mTime);
    buttons[id] = new Button(id, mTime);
  }
});
