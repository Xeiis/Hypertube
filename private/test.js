var Throttle = require('throttle');

exports.renderTest = function(req, res)
{
    throttle = new Throttle(1);
    var html = 'salut a toi';
    process.html.pipe(throttle).pipe(res);
};