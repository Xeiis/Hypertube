//var Mongo = require ('./mongodb.js');

exports.renderIndex = function(req, res)
{
    res.render('index');
};

exports.renderTest = function(req, res)
{
    res.render('test');
};