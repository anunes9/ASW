var express     = require('express');
var router      = express.Router();
var websocket   = require ('../wsocket/gameHandler');

// var User        = require('../config/user_model');
// var GameRequest = require('../config/game_request_model');
// var GameStatus  = require('../config/game_status_model');
// var GamePlayers = require('../config/game_players_model');

router.get('/', function(req, res, next) {

    if (!req.session.user)
        return res.render('rooms' ,{ 
        	title    : 'ALL IN!',
        	loginDiv : true,
        	active   : {rooms: true}
        });
    else {
        res.render('rooms',{
            title    : 'ALL IN!',
            loginDiv : false,
            user     : req.session.user,
            active   : {rooms: true}
        });
    }
});


module.exports = router; 