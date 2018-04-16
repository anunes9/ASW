var express     = require('express');
var router      = express.Router();
var app         = require('../app');
var GameRequest = require('../config/game_request_model');

// var User        = require('../config/user_model');
var GamePlayers = require('../config/game_players_model');

router.get('/:id', function(req, res, next) {
    if (!req.session.user)
        return res.render('game', {title: 'ALL IN!', loginDiv: true, active: {rooms: true}});
    else {

        // verificar se jogo existe

        GameRequest.find({where: {id: req.params.id}}).then(function (gr) {

            if (!gr) {
                // console.log('se o id do link nao existir como jogo');
                return res.render('error');
            }
            else {
                // console.log('sabendo que o jogo existe, vamos ver se o jogador existe no jogo.');
                GamePlayers.find({where: {player_id: req.session.user.id}}).then(function (gp) {
                    if(gp) {
                        if(gp.game_id !== gr.id) {
                            // console.log('jogador existe, mas não neste jogo');
                            return res.render('error');
                        }
                        // ok portanto, jogo existe e eu nao estou noutro.
                        // console.log('Já estava no jogo');

                        if(req.session.user.id === gr.owner)
                        //po == true;
                            res.render('game', {title: 'ALL IN!', active: {rooms: true}, user: req.session.user, game:gr, playerOwner: true});
                        else
                            res.render('game', {title: 'ALL IN!', active: {rooms: true}, user: req.session.user, game:gr, playerOwner: false});
                    }
                    else {
                        // console.log('Não estava no jogo');

                        if(req.session.user.id === gr.owner)
                        //po == true;
                            res.render('game', {title: 'ALL IN!', active: {rooms: true}, user: req.session.user, game:gr, playerOwner: true});
                        else
                            res.render('game', {title: 'ALL IN!', active: {rooms: true}, user: req.session.user, game:gr, playerOwner: false});
                    }
                });
            }
        });
    }
});

router.post('/:id/foldbet', function(req, res){
    console.log(req.body);

    console.log('Fold bet in room' + req.body.gameid + ' player: ' + req.body.user);
});

router.post('/:id/coverbet', function(req, res){

    console.log('cover bet in room' + room + ' player: ' + player);  
});

router.post('/:id/raisebet', function(req, res){

    console.log('raise bet in room' + room + ' player: ' + player + ' bet: ' + bet); 
});


module.exports = router;