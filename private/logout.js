/**
 * Created by aliandie on 10/27/16.
 */

exports.logout = function(req, res)
{
    if (req.session.login)
    {
        req.session.destroy();
        res.send("OK");
    }
    else
        res.send("You are not connected");
    res.end();
}