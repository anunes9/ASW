var Player = require('./player.js');
var PokerEvaluator = require('poker-evaluator');

function Game(iBet, io, route, gameId) {
	// Game attributes
	this.bet = iBet;

	this.players	= [];         	// array of Player object, represents all players in this game
	this.round 		= 'idle';   	// current round in a game
	this.dealerPos 	= 0;         	// to determine the dealer position for each game, incremented by 1 for each end game
	this.turnPos 	= 0;           	// to determine whose turn it is in a playing game
	this.pot 		= 0;         	// accumulated chips in center of the table
	this.communityCards = [];   	// array of Card object, five cards in center of the table
	this.deck 		= new Deck();  	// deck of playing cards
	this.io 		= io;			// socket
	this.route 		= route;		// route
	this.gameId 	= gameId;		// gameId
}

/**
 * Adds new player to the game
 * @param attr
 */
Game.prototype.addPlayer = function(attr) {
	var newPlayer = new Player(attr);
	console.log('Player ' + newPlayer.name + ' added to the game');
	newPlayer.game = this;
	this.players.push(newPlayer);
};

/**
 * Resets game to the default state
 */
Game.prototype.reset = function() {
	console.log('Game reset');
	this.round = 'idle';
	this.communityCards = [];   // clear cards on board
	this.pot = 0;               // clear pots on board
	this.deck = new Deck();     // use new deck of cards
	for (var i=0; i<this.players.length; i++) {
		this.players[i].reset();
	}
};

/**
 * Starts the 'deal' Round
 */
Game.prototype.start = function() {

	this.reset();
	console.log('========== STARTING GAME ==========');

	// deal two cards to each players
	for (var i=0; i<this.players.length; i++) {
		var c1 = this.deck.drawCard();
		var c2 = this.deck.drawCard();
		console.log('Player ' + this.players[i].name + ' gets card : ' + c1 + ' & ' + c2);
		this.players[i].firstCard = c1;
		this.players[i].secondCard = c2;
	}

	// determine dealer, small blind, big blind
	// modulus with total number of players
	// numbers will back to 0 if exceeds the number of players
	console.log('Player ' + this.players[this.dealerPos].name + ' is the dealer');
	//var smallBlindPos = ( this.dealerPos+1 ) % this.players.length;
	var bigBlindPos = ( this.dealerPos+1 ) % this.players.length;

	// small and big pays blind
	//this.players[smallBlindPos].addBet(1/2 * this.bet);
	this.players[bigBlindPos].addBet(this.bet);

	//console.log('Player ' + this.players[smallBlindPos].name + ' pays small blind : ' + (1/2 * this.bet));
	console.log('Player ' + this.players[bigBlindPos].name + ' pays big blind : ' + this.bet);

	// determine whose turn it is
	this.turnPos = ( bigBlindPos+1 ) % this.players.length;
	console.log('Now its player ' + this.players[this.turnPos].name + '\'s turn');

	// begin game, start 'deal' Round
	console.log('========== Round DEAL ==========');
	this.round = 'deal';
};

Game.prototype.incrementPlayerTurn = function() {
	do {
		this.turnPos = ( this.turnPos+1 ) % this.players.length;
	} while(this.players[this.turnPos].hasDone);
};

/**
 * Check if ready to begin new round
 * Round ends when all players' bet are equal,
 * With exception Fold and All-in players
 * @returns {boolean}
 */
Game.prototype.isEndRound = function() {
	var endOfRound = true;
	//For each player, check
	for(var i=0; i<this.players.length; i++) {
		var plyr = this.players[i];
		if (!plyr.hasActed && !plyr.hasDone) {
			endOfRound = false;
		}
	}
	return endOfRound;
};

/**
 * Play the next round
 */
Game.prototype.nextRound = function() {
	if (this.round === 'idle') {
		this.start();
	} else if (this.round === 'deal') {
		this.gatherBets();
		this.flop();
	} else if (this.round === 'flop') {
		this.gatherBets();
		this.turn();
	} else if (this.round === 'turn') {
		this.gatherBets();
		this.river();
	} else if (this.round === 'river') {
		this.gatherBets();
		this.showdown();
	} else {
		this.start();
	}
};

/**
 * Checks if ready to next round
 * If yes, starts the next round
 */
Game.prototype.checkForNextRound = function() {
	if (this.isEndRound()) {
		console.log('begin next round');
		this.nextRound();
	} else {
		console.log('cannot begin next round');
	}
};

/**
 * Starts the 'flop' Round
 */
Game.prototype.flop = function() {
	console.log('========== Round FLOP ==========');
	this.round = 'flop';
	// deal three cards in board
	this.communityCards[0] = this.deck.drawCard();
	this.communityCards[1] = this.deck.drawCard();
	this.communityCards[2] = this.deck.drawCard();
	// begin betting
	console.log('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2]);
	// other players must act
	this.requestPlayerAction();

	var cards = [];
    for (i=0; i<this.communityCards.length; i++){
	    cards.push(this.communityCards[i]);
    }

    var serverInfo = {
        room			: this.room,
        gameId			: this.gameId,
        username		: this.getCurrentPlayer().name,
        currentPlayer	: this.getCurrentPlayer().id,
        communityCards	: cards,
        pot				: this.pot,
        currentBet		: this.bet,
        gamePlayers		: this.getAllPlayers()
    };

	this.io.of(this.route).emit('flopRound', serverInfo);
};

/**
 * Starts the 'turn' Round
 */
Game.prototype.turn = function() {
	console.log('========== Round TURN ==========');
	this.round = 'turn';
	// deal fourth card
	this.communityCards[3] = this.deck.drawCard();
	// begin betting
	console.log('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2] + ', ' + this.communityCards[3]);
	// other players must act
	this.requestPlayerAction();

    var cards = [];
    for (i=0; i<this.communityCards.length; i++){
        cards.push(this.communityCards[i]);
    }

    var serverInfo = {
        room			: this.room,
        gameId			: this.gameId,
        username		: this.getCurrentPlayer().name,
        currentPlayer	: this.getCurrentPlayer().id,
        communityCards	: cards,
        pot				: this.pot,
        currentBet		: this.bet,
        gamePlayers		: this.getAllPlayers()
    };

    this.io.of(this.route).emit('turnRound', serverInfo);
};

/**
 * Starts the 'river' Round
 */
Game.prototype.river = function() {
	console.log('========== Round RIVER ==========');
	this.round = 'river';
	// deal fifth card
	this.communityCards[4] = this.deck.drawCard();
	// begin betting
	console.log('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2] + ', ' + this.communityCards[3] + ', '  + this.communityCards[4]);
	// other players must act
	this.requestPlayerAction();

    var cards = [];
    for (i=0; i<this.communityCards.length; i++){
        cards.push(this.communityCards[i]);
    }

    var serverInfo = {
        room			: this.room,
        gameId			: this.gameId,
        username		: this.getCurrentPlayer().name,
        currentPlayer	: this.getCurrentPlayer().id,
        communityCards	: cards,
        pot				: this.pot,
        currentBet		: this.bet,
        gamePlayers		: this.getAllPlayers()
    };

    this.io.of(this.route).emit('riverRound', serverInfo);
};

/**
 * Starts the 'showdown' Round
 */
Game.prototype.showdown = function() {
	console.log('========== SHOWDOWN ==========');
	this.round = 'showdown';
	// gather all hands
	var hands = [];
	for (var i=0; i<this.players.length; i++) {
		hands.push([
			this.players[i].firstCard,
			this.players[i].secondCard,
			this.communityCards[0],
			this.communityCards[1],
			this.communityCards[2],
			this.communityCards[3],
			this.communityCards[4]
		]);
	}
	// evaluate all cards
	var evalHands = [];
	for (i=0; i<hands.length; i++) {
		evalHands.push(PokerEvaluator.evalHand(hands[i]));
	}
	console.log('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2] + ', ' + this.communityCards[3] + ', '  + this.communityCards[4]);
	// get highest value
	var highestVal = -9999;
	var highestIndex = -1;
	for (i=0; i<evalHands.length; i++) {
		console.log('Player ' + this.players[i].name + ' : ' + this.players[i].firstCard + ', ' + this.players[i].secondCard + ' | strength : ' + evalHands[i].value + ' | ' + evalHands[i].handName);
		if (highestVal < evalHands[i].value) {
			highestVal = evalHands[i].value;
			highestIndex = i;
		}
	}
	console.log('Player ' + this.players[highestIndex].name + ' wins with ' + evalHands[highestIndex].handName);

    var cards = [];
    for (i=0; i<this.communityCards.length; i++){
        cards.push(this.communityCards[i]);
    }

    var serverInfo = {
        room			: this.room,
        gameId			: this.gameId,
        username		: this.getCurrentPlayer().name,
        currentPlayer	: this.getCurrentPlayer().id,
        communityCards	: cards,
        pot				: this.pot,
        currentBet		: this.bet,
        gamePlayers		: this.getAllPlayers(),
		winner			: this.players[highestIndex].name
    };

    this.io.of(this.route).emit('showdownRound', serverInfo);
};

/**
 * Get the highest bet from all players
 * @returns {number} highestBet
 */
Game.prototype.getHighestBet = function() {
	var highestBet = -999;
	for(var i=0; i<this.players.length; i++) {
		if (highestBet < this.players[i].bet) {
			highestBet = this.players[i].bet;
		}
	}
	return highestBet;
};

/**
 * Collect all bets from players to the board's pot
 */
Game.prototype.gatherBets = function() {
	for(var i=0; i<this.players.length; i++) {
		this.pot += this.players[i].bet;
		this.players[i].bet = 0;
	}
	console.log("Total Pot : " + this.pot)
};

/**
 * returns the player whose current turn it is
 * @returns {Player}
 */
Game.prototype.getCurrentPlayer = function() {
	return this.players[this.turnPos];
};

Game.prototype.getAllPlayers = function () {
	var a = [];
    for(var i=0; i<this.players.length; i++) {
        a.push(this.players[i].name);
        a.push(this.players[i].chips);
        a.push(this.players[i].id);
    }

    console.log(a);

	return a;
};

Game.prototype.getAllBets = function () {
    var a = [];
    for(var i=0; i<this.players.length; i++) {
        a.push(this.players[i].name);
        a.push(this.players[i].bet);
    }
    return a;
};

Game.prototype.getPlayerCards = function (id) {
    var a = {};
    for(var i=0; i<this.players.length; i++) {
        if (this.players[i].id === id)
            a = {'1': this.players[i].firstCard, '2': this.players[i].secondCard};
    }
    return a;
};

/**
 * Sets all players' hasActed to false
 */
Game.prototype.requestPlayerAction = function() {
	for (var i=0; i<this.players.length; i++) {
		if (!this.players[i].hasDone) {
			this.players[i].hasActed = false;
		}
	}
};

function Deck() {
    this.suits = [ 'spades', 'hearts', 'diamonds', 'clubs' ];
    this.ranks = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a' ];
    this.cards = [];

    this.init();
    this.shuffle();
}

Deck.prototype.init = function() {
    var suitsLen = this.suits.length;
    var ranksLen = this.ranks.length;
    var i, j;

    for (i=0; i<suitsLen; i++) {
        for (j=0; j<ranksLen; j++) {
            this.cards.push( this.ranks[j] + ':' + this.suits[i] );
        }
    }
};

/**
 * Fisher-Yates Shuffle
 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
Deck.prototype.shuffle = function() {
    var currentIndex = this.cards.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this.cards[currentIndex];
        this.cards[currentIndex] = this.cards[randomIndex];
        this.cards[randomIndex] = temporaryValue;
    }
};

Deck.prototype.drawCard = function () {
    return this.cards.pop();
};

module.exports = Game;