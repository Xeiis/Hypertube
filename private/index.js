exports.renderIndex = function(req, res, translation, langue){
    if (req.session.login)
        res.render('index', {login: true, name: req.session.login, translation: translation, langue: langue});
    else
        res.render('index', {login: false, translation: translation, langue: langue});
};

