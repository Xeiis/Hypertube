const PirateBay = require('thepiratebay');

exports.renderIndex = function(req, res)
{
    if (req.session.login)
        res.render('index', {login: true, name: req.session.login});
    else
        res.render('index', {login: false});
};

