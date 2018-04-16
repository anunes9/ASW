var express     = require('express');
var User        = require('../config/user_model');
var router      = express.Router();
var bcrypt      = require('bcryptjs');
var gamerequest = require('../config/game_request_model');
var app         = require('../app');

router.get('/', function (req, res) {
});

module.exports = router;