/**
 * Created by aliandie on 10/27/16.
 */

exports.logout = function(req, res,translation, langue)
{
    if (req.session.login)
    {
        req.session.destroy();
        res.send({res: "OK", translation: translation});
    }
    else
        res.send({res: "You are not connected", translation: translation});
    res.end();
};