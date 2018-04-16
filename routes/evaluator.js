var express     = require('express');
var router      = express.Router();
var PokerEvaluator = require("poker-evaluator");


router.get('/', function (req, res) {

    var ranks    = ['j', 'q', 'k', 'a' ];
    var newranks = ['J', 'Q', 'K', 'A' ];
    var suits    = ['spades', 'hearts', 'diamonds', 'clubs'];
    var newsuits = ['s', 'h', 'd', 's'];

    // var response = PokerEvaluator.evalHand(["As", "Ks", "Qs", "Js", "Ts", "3c", "5h"]);

    var allhand = req.query.hands;
    allhand = allhands.split(",");
    var newhands = [];
    var newplayer = [];



    var hands = allhand.split(" ");

    allhand.forEach(function (hand, p2, p3) {

        hands.forEach(function (hand, p2, p3) {
            var string = [];
            string = hand.charAt(0);
            var string2 = [];
            string2 = hand.charAt(1);
            console.log(string2);

            var array1 = ranks;
            var array2 = newranks;
            var array3 = suits;
            var array4 = newsuits;

            var str1 = array1.join('');
            var re = new RegExp('[' + str1 + ']', 'g');
            /*
             var str2 = array3.join('');
             var ree = new RegExp('[' + str2 + ']', 'g');
             */
            string = string.replace(re, function (c) {
                return array2[str1.indexOf(c)]
            });
            /*
             string2 = string2.replace(ree, function (c) {
             return array4[str2.indexOf(c)]
             });
             */

            newhands.push(string + string2);
        });
        newplayer[p2] = newplayer[p2] + newhands;
    });

    res.send(newplayer);

    // var string = 'This is a text that needs to change';



    /**

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


    */

    // res.send(response);
});

module.exports = router;