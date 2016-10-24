/**
 * Created by dchristo on 10/24/16.
 */
var hbjs = require("handbrake-js");

exports.conversion_video = function(req, res)
{
    hbjs.spawn({ input: "dope shit.avi", output: "dope shit.m4v" })
        .on("error", function(err){
            res.send('fail' + err);
            res.end();
        })
        .on("progress", function(progress){
            res.send("Percent complete: " + progress.percentComplete + ", ETA: " + progress.eta);
            res.end();
        });
};