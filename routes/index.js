var express = require('express');
var router = express.Router();
var index = require('../private/index.js');

/* GET */

router.get('/', function(req, res) {
    console.log("/");
    index.renderIndex(req, res);
});

router.get('/test', function(req, res) {
    console.log("/test");
    index.renderTest(req, res);
});

module.exports = router;