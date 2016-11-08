const PirateBay = require('thepiratebay');

exports.renderIndex = function(req, res)
{
    /*PirateBay.topTorrents()
        .then(results => {
        res.render('index', {top100 : results});
    })
    .catch(err => {
        console.log(err);
        res.end();
    })*/
    res.render('index');
};

