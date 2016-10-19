var express = require('express');
var router = express.Router();
var index = require('../private/index.js');

/* GET */

router.get('/', function(req, res) {
    console.log("/");
    index.renderIndex(req, res);
});

module.exports = router;