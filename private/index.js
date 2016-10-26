const PirateBay = require('thepiratebay');

exports.renderIndex = function(req, res)
{
    PirateBay.topTorrents(/*category*/)
        .then(results => {
        res.render('index', {top100 : results});
    })
    .catch(err => {
        console.log(err);
        res.end();
    })
};

function login(req, res)
{
    res.render('login');
}
