var Throttle = require('throttle');

var throttle = new Throttle(1);
process.stdin.pipe(throttle).pipe(process.stdout);

exports.renderTest = function(req, res)
{
    var html = 'salut a toi';
    throttle = new Throttle(1);
    throttle.pipe(throttle).pipe(res);
};