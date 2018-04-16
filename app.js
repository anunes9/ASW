var express      = require('express');
var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var index        = require('./routes/index');
var admin        = require('./routes/admin');
var rooms        = require('./routes/rooms');
var games     	 = require('./routes/games');
var profile      = require('./routes/profile');
var waiting      = require('./routes/waiting');
var evaluator    = require('./routes/evaluator');
var session      = require('express-session');
var helmet       = require('helmet');
var connection   = require('./config/deploy');
// var GameRequest  = require('./config/game_request_model.js');
var websocket    = require('./wsocket/gameHandler.js');
// var gameStatus   = require('./config/game_status_model.js');
var Game		= require('./game/game');
var bcrypt      = require('bcryptjs');
var User        = require('./config/user_model');
var um       = require('./routes/um');
var dois    = require('./routes/dois');

// server start
var app = express();

// call socket.io to the app
var server = require('http').Server(app);
var io = require('socket.io')(server);

// GameRequest.sync();
// gameStatus.sync();

var liveGames = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// skeleton defaults
/*
app.use(function(req, res, next){
	req.io = io;
	req.socketdict = socketdict;
	next();
});
*/

app.use(logger('dev'));
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// config session, with cookies
// var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(session({
	secret:'very secret session',
	resave: false,
	saveUninitialized: true
}));

//define the routes
app.use('/', index);
app.use('/admin', admin);
app.use('/profile', profile);
app.use('/rooms', rooms);
app.use('/games/', games);
app.use('/wgames/', waiting);
app.use('/um/', um);
app.use('/dois', dois);
// app.use('/evaluator', evaluator);

// vou comerçar a segunda parte pelas partes opcionais e assim
// 1. Implementar melhor segurança. uso do modulo helmet
app.use(helmet());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

/**
 * socket.io logic.
 *
 * "API" for the async calls to the game, using websockets.
 */

io.on('connection', function (socket) {

    /**
     * Envia salas quando o client se liga ou quando existem actualizações (Rooms.js)
     */

	socket.on('first', function () {

		websocket.sendAllRooms().then(function (rooms) {

            socket.emit('fetchRooms', rooms);
            socket.broadcast.emit('fetchRooms', rooms);
        });
	});

    /**
     * Cria sala, avisa os restantes clientes da criação da sala e adiciona o criador dentro à sala (Rooms.js)
     */

	socket.on('addGame', function(data) {

		websocket.createGameRequest(data).then(function (cgr) {

			websocket.sendAllRooms().then(function (rooms) {

                socket.emit('updateGames', rooms);
                socket.broadcast.emit('updateGames', rooms);
            });

			websocket.addPlayerToRoom(cgr.id, data.owner, cgr);

			// ao criar um jogo, convem criar logo o namespace para a room
			var gamensp = io.of('/games/' + cgr.id);

        }).catch(function (err) {
			socket.emit(err[0], err[1]);
        });
	});

    /**
     * Games.js
     */

	socket.on('joinGame', function (data) {

        /**
         * This essentially makes sure that a namespace is exists under the name of the desired one.
         * It doesn't mess it up or reset the namespace when it is called again.
         *
         * Chamadas à db todas feitas com promises, para um programação async mais fácil
         */

        websocket.addPlayerToRoom(data.gameId, data.userId).then(function (gr) {
            if(gr) {
                websocket.countRoomPlayers(data.gameId, gr).then(function (count) {
                	io.of(data.room).emit('countPlayers', count);
                });
            }
            else
                console.log('\n' + 'addPlayerToRoom:: este jogador já existe neste jogo');
        });


    });

	socket.on('enterGame', function (data) {

		websocket.updateGameRequest(data.gameId).then(function (gr) {

            // inicio do jogo, e primeiro pedido
			liveGames[data.gameId] = new Game(data.inicialBet, io, data.room, data.gameId);

			websocket.addPlayersToGame(data.gameId, liveGames[data.gameId], 0).then(function (game) {
				liveGames[data.gameId] = game;
				liveGames[data.gameId].start();
                io.of(data.room).emit('updateUrl', data);
            });
        });
    });

	socket.on('initGame', function (data) {

        socket.emit('playerCards', liveGames[data.gameId].getPlayerCards(data.userId));

		var serverInfo = {
            room			: data.room,
            gameId			: data.gameId,
            username		: liveGames[data.gameId].getCurrentPlayer().name,
            currentPlayer	: liveGames[data.gameId].getCurrentPlayer().id,
            comunityCards	: liveGames[data.gameId].comunityCards,
            pot				: liveGames[data.gameId].pot,
			currentBet		: liveGames[data.gameId].bet,
			gamePlayers		: liveGames[data.gameId].getAllPlayers()
        };

        io.of(data.room).emit('initGame', serverInfo);

    });

	// apartir de agora, sempre que emitir para data.room, ele vai para aquela sala

	socket.on('checkBet', function (ci) {
		if(liveGames[ci.gameId].getCurrentPlayer().id === ci.userId) {
            liveGames[ci.gameId].getCurrentPlayer().callOrCheck();

            var serverInfo = {
                room			: ci.room,
                gameId			: ci.gameId,
				username		: liveGames[ci.gameId].getCurrentPlayer().name,
                currentPlayer	: liveGames[ci.gameId].getCurrentPlayer().id,
                comunityCards	: liveGames[ci.gameId].comunityCards,
                pot				: liveGames[ci.gameId].pot,
                currentBet		: liveGames[ci.gameId].bet,
                gamePlayers		: liveGames[ci.gameId].getAllPlayers()
            };

            io.of(ci.room).emit('coverBet', serverInfo);
        }
    });

    socket.on('foldBet', function (ci) {
        if(liveGames[ci.gameId].getCurrentPlayer().id === ci.userId) {
            liveGames[ci.gameId].getCurrentPlayer().fold();

            var serverInfo = {
                room			: ci.room,
                gameId			: ci.gameId,
                username		: liveGames[ci.gameId].getCurrentPlayer().name,
                currentPlayer	: liveGames[ci.gameId].getCurrentPlayer().id,
                comunityCards	: liveGames[ci.gameId].comunityCards,
                pot				: liveGames[ci.gameId].pot,
                currentBet		: liveGames[ci.gameId].bet,
                gamePlayers		: liveGames[ci.gameId].getAllPlayers()
            };
        }
        io.of(ci.room).emit('foldBet', serverInfo);
    });



    socket.on('raiseBet', function (ci) {
        if(liveGames[ci.gameId].getCurrentPlayer().id === ci.userId) {
            liveGames[ci.gameId].getCurrentPlayer().raise(ci.raiseValue);

            var serverInfo = {
                room			: ci.room,
                gameId			: ci.gameId,
                username		: liveGames[ci.gameId].getCurrentPlayer().name,
                currentPlayer	: liveGames[ci.gameId].getCurrentPlayer().id,
                comunityCards	: liveGames[ci.gameId].comunityCards,
                pot				: liveGames[ci.gameId].pot,
                currentBet		: liveGames[ci.gameId].bet,
                gamePlayers		: liveGames[ci.gameId].getAllPlayers()
            };
        }
        io.of(ci.room).emit('raiseBet', serverInfo);
    });

});

/**
 * Definição do Servico SOAP (usando soap-server)
 */

var soap = require('strong-soap').soap;

soapPlay = function (args) {
    return new Promise(function (resolve, reject) {

        // check if game exists
        if (liveGames[args.id] !== undefined) {
            // check if user exists
            User.find({where: {username: args.user}}).then(function (user) {
                if (user) {
                    if (bcrypt.compareSync(args.pwd, user.get('pwd'))) {
                        console.log('cenas');
                        // check if user is playing
                        if (liveGames[args.id].getAllPlayers().includes(args.user)) {
                            //aqui estou no jogo em que o user esta
                            //falta verificar se é a vez dele
                            if (args.user === liveGames[args.id].getCurrentPlayer().name) {
                                var game = "/games/" +args.id;
                                var serverInfo;

                                if (args.play === 'check') {
                                    liveGames[args.id].getCurrentPlayer().callOrCheck();

                                    serverInfo = {
                                        room			: game,
                                        gameId			: args.id,
                                        username		: liveGames[args.id].getCurrentPlayer().name,
                                        currentPlayer	: liveGames[args.id].getCurrentPlayer().id,
                                        comunityCards	: liveGames[args.id].comunityCards,
                                        pot				: liveGames[args.id].pot,
                                        currentBet		: liveGames[args.id].bet,
                                        gamePlayers		: liveGames[args.id].getAllPlayers()
                                    };

                                    io.of(game).emit('coverBet', serverInfo);

                                    resolve('Aceite play check');
                                }
                                else if (args.play === 'fold') {
                                    liveGames[args.id].getCurrentPlayer().fold();

                                    serverInfo = {
                                        room			: game,
                                        gameId			: args.id,
                                        username		: liveGames[args.id].getCurrentPlayer().name,
                                        currentPlayer	: liveGames[args.id].getCurrentPlayer().id,
                                        comunityCards	: liveGames[args.id].comunityCards,
                                        pot				: liveGames[args.id].pot,
                                        currentBet		: liveGames[args.id].bet,
                                        gamePlayers		: liveGames[args.id].getAllPlayers()
                                    };

                                    io.of(game).emit('foldBet', serverInfo);

                                    resolve('Aceite play fold');

                                }
                                else if (args.play === 'raise') {
                                    liveGames[args.id].getCurrentPlayer().raise(args.value);

                                    serverInfo = {
                                        room			: game,
                                        gameId			: args.id,
                                        username		: liveGames[args.id].getCurrentPlayer().name,
                                        currentPlayer	: liveGames[args.id].getCurrentPlayer().id,
                                        comunityCards	: liveGames[args.id].comunityCards,
                                        pot				: liveGames[args.id].pot,
                                        currentBet		: liveGames[args.id].bet,
                                        gamePlayers		: liveGames[args.id].getAllPlayers()
                                    };

                                    io.of(game).emit('raiseBet', serverInfo);

                                    resolve('Aceite play raise');
                                }
                            } else
                                resolve("Not Player's turn");
                        } else
                            resolve('Player not in game.');
                    } else
                        resolve('Password wrong.');
                } else
                    resolve('User not found.');
            });
        } else
            resolve('Game not exist.');
    });
};

var myService = {
    Game_WebService: {
        PokerCards_Port: {
            InfoPartida: function (args) {
                if (liveGames[args.id] !== undefined) {

                    var players = liveGames[args.id].getAllBets();

                    return {
                        inicio: Math.floor(Date.now() / 1000),
                        jogadorActual: liveGames[args.id].getCurrentPlayer().name.toString(),
                        cartasNaMesa: liveGames[args.id].comunityCards,
                        minhasCartas: liveGames[args.id].getCurrentPlayer().firstCard + " " + liveGames[args.id].getCurrentPlayer().secondCard,
                        apostas: players.toString()
                    };
                }
                else {
                    return {
                        inicio: Math.floor(Date.now() / 1000),
                        jogadorActual: "jogo não existe",
                        cartasNaMesa: "jogo não existe",
                        minhasCartas: "jogo não existe",
                        apostas: "jogo não existe"
                    }
                }
            },
            ApostaJogo: function (args, callback) {
                soapPlay(args).then(function (resposta) {
                    callback ({
                        response: resposta
                    });
                });
            }
        }
    }
};

var xml = require('fs').readFileSync('./GameWebService.wsdl', 'utf8');

soap.listen(server, '/game', myService, xml);

module.exports = {app: app, server: server, io: io};