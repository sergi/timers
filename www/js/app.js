
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Need to verify receipts? This library is included by default.
    // https://github.com/mozilla/receiptverifier
    require('receiptverifier');
    require('./install-button');
    var Button = require('./button');

    //var height = window.screen.availHeight
    //var width = window.screen.availWidth
    var width = window.innerWidth;
    var height = window.innerHeight;

    var rows = width > height ? 4 : 3;
    var cols = width > height ? 3 : 4;

    var side = Math.ceil(0.25 * (width > height ? height : width))

    var rowWidth = width > height ? side * 4 : side * 3;
    var rowHeight = width > height ? side * 3 : side * 4;
    var blankWidth = (width - rowWidth) / (width > height ? 5 : 4);
    var blankHeight = (height - rowHeight) / (width > height ? 4 : 5);
    var times = [1, 2, 3, 5, 10, 15, 30, 45, 60];
    for (var i=0, k=0; i<cols; i++) {
        for (var j=0; j<rows; j++) {
            var x = (side * j) + blankWidth * (j + 1)
            var y = (side * i) + blankHeight * (i + 1)
            var time = times[k] || null;
            var b = new Button(time ? time * 60 * 1000 : null);
            b.render(x, y, side);
            k++;
        }
    }
});

