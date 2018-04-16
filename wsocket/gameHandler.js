/*
 * game logic and ws shit
 *
 */

var sequelize   = require('sequelize');
var GameRequest = require('../config/game_request_model');
var GamePlayers = require('../config/game_players_model');
var User        = require('../config/user_model');
var Game        = require('../game/game');
var Promise     = require('promise');

module.exports = {

    /*
     * metodos para iniciar uma sala (rooms.js)
     *
     * (modificado)
     *
     */

    /*
     * sendAllRooms (socket, route)
     *
     * envia um broadcast para todos os clientes com as salas existentes (não terminadas).
     * esta funcão só é chamada após a criação de uma nova sala.
     *
     * parametros:
     *   socket    : server socket
     *   route     : nome da route para comunicar com o cliente
     *
     */

    sendAllRooms: function () {
        return new Promise(function (resolve, reject) {

            GameRequest.findAll({where: {finished: false}}).then(function (r) {
                var allrooms = [];
                for (var i = 0; i < r.length; i++)
                    allrooms.push(r[i].get({plain: true}));

                resolve({a: allrooms});
            });
        });
    },


    /*
     * createGameRequest(data, socket)
     *
     * cria uma entrada de Game Request, se o owner ainda não tiver uma.
     *
     * Chama sendAllRooms & addPlayerToRoom em caso de sucesso.
     *
     * parametros:
     *   data  : json para preencher os dados
     *   socket  : server socket
     *
     */


    createGameRequest: function (data) {
        return new Promise(function (resolve, reject) {

            GameRequest.find({where: {owner: data.owner}}).then(function (gr) {

                if(!gr) {
                    GameRequest.create({
                        name        : data.name,
                        description : data.description,
                        maxPlayers  : data.maxPlayers,
                        owner       : data.owner,
                        ownerName   : data.username,
                        first_bet   : data.first_bet
                    }).then( function (cgr) {
                        if(cgr) {
                            console.log('\n' + 'createGameRequest:: criou um. Adicionar Owner à Room...');
                            resolve(cgr);
                        }
                    });
                }
                else {
                    console.log('\n' + 'createGameRequest:: já existe um');
                    reject(['addGameError', 'Game already exists or Owner already created a game']);
                }
            });
        });
    },

    /*
     *  addPlayerToRoom (socket, route, gameId, userId,)
     *
     *  cria uma entrada de Game Players,
     *  se o user ainda não tiver uma associada a um Game Request.
     *
     *  parametros:
     *      gameId  : Game Request id
     *      userId  : User id
     *      socket  : server socket (of the room)
     *      route   : nome da route para comunicar com o cliente
     *
     */


    addPlayerToRoom: function (gameId, userId, gr) {
        return new Promise(function (resolve, reject) {

            GamePlayers.find({where: {player_id: userId}}).then(function (gp) {
                if (!gp) {
                    GamePlayers.create({
                        game_id: gameId,
                        player_id: userId
                    }).then(function (cgp) {
                        if (cgp) {

                            console.log('\n' + 'addPlayertoRoom:: criou um. adding in GameRequest...');
                            if(gr) {
                                gr.countPlayers = gr.countPlayers + 1;
                                gr.save();

                                console.log('\n' + 'addPlayerToRoom:: Adicionado a GameRequest. ...');

                                if (cgp.player_id !== gr.owner) {
                                    console.log('\n' + 'Calling countRoomPlayers (not owner)');
                                    resolve(gr);
                                }
                            }
                            else {
                                GameRequest.find({where: {id: gameId}}).then(function (gr) {
                                    gr.countPlayers = gr.countPlayers + 1;
                                    gr.save();

                                    console.log('\n' + 'addPlayerToRoom:: Adicionado a GameRequest. ...');

                                    if (cgp.player_id !== gr.owner) {
                                        console.log('\n' + 'Calling countRoomPlayers (not owner)');
                                        resolve(gr);
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    resolve();
                }
            });
        });
    },


    /*
     *  countRoomPlayers(gameId, socket, route, cgp)
     *
     *  envia um broadcast para todos os clientes de um jogo não iniciado, a info sobre o estado do jogo.
     *  esta funcão é chamada sempre que um jogador se junta a uma sala
     *
     *  parametros:
     *      gameId  : id de uma sala
     *      socket  : server socket
     *      route   : nome da route para comunicar com o cliente
     *      cgr     : Model do GameRequest (opcional)
     */

    updateGameRequest: function (gameId) {
      return new Promise(function (resolve, reject) {
         GameRequest.find({where: {id: gameId}}).then(function (gr) {
             gr.started = true;
             gr.save();
             resolve(gr);
         });
      });
    },

    countRoomPlayers: function (gameId, cgr) {
        return new Promise(function (resolve, reject) {
            if(cgr)
                findUser(cgr).then(function (user){ resolve(user) });
            else
                GameRequest.find({where: {id: gameId}}).then(function (gr){ findUser(gr).then(function (user){ resolve(user) });});
        });
    },
    
    addPlayersToGame: function (gameId, liveGame, ctl) {
        return new Promise(function (resolve, reject) {
            GamePlayers.findAll({where: {game_id: gameId}}).then(function (players) {

                players.forEach(function (player, index, array) {

                    User.find({where: {id: player.player_id}}).then(function (user) {

                        liveGame.addPlayer({id : user.id, name: user.username, chips : user.credit});
                        
                        if (index === array.length - 1) {
                            console.log('tou ca');
                            resolve(liveGame);
                        }
                    });
                });
            });
        });
    }
};

/*
 *  findUser (gamereq)
 *
 *  função auxiliar (para melhor leitura do código).
 *
 *  Encontra o owner de um jogo, e acaba de executar countRoomPlayers,
 *  passando aos clients a info do pre-game.
 *
 *  parametros:
 *      gamereq : Model do GameRequest
 *      socket  : server socket
 *      route   : nome da route para comunicar com o(s) cliente(s)
 *
 */

function findUser (gamereq) {
    return new Promise(function (resolve, reject) {
        User.find({where: {id: gamereq.owner}}).then(function (user) {
            resolve({nplayers: gamereq.countPlayers, firstbet: gamereq.first_bet, name: user.username});
        });
    });
}
