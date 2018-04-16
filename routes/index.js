var express     = require('express');
var User        = require('../config/user_model');
var router      = express.Router();
var bcrypt      = require('bcryptjs');
var gamerequest = require('../config/game_request_model');
var app         = require('../app');
// var gamestatus  = require('../config/game_status_model');
// TODO: usar base64 para user:pwd entre pedidos rest.

var countryList = ["Africa", "Albania", "Andorra", "Asia", "Australia", "Austria", "Belarus", "Belgium",
    "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland", "France",
    "Germany", "Gibraltar", "Greece", "Hungary", "Iceland", "Ireland", "Isle of Man", "Italy", "Kosovo", "Latvia",
    "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands",
    "North America", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia",
    "South America", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Russia"];

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.admin) {
        req.session.destroy();
        res.redirect('/');
    }
    else if (!req.session.user)
        res.render('index', { title: 'ALL IN!', loginDiv: true, country: countryList, active: {index: true} });
    else {
        res.render('index', { title: 'ALL IN!', loginDiv: false, user: req.session.user, active: {index: true} });
    }
});

/* Loggin */
router.post('/login', function (req, res) {
    User.findOne({where: {username: req.body.user_name}}).then(function (user) {
        if (!user)
            //res.render('index', {cenas: 'user not found', active: {index: true}});
            res.render('index', { title: 'ALL IN!', loginDiv: true, loginErr: true, country: countryList, active: {index: true} });
        else {
            if(!bcrypt.compareSync(req.body.pw, user.get('pwd')))
                res.render('index', { title: 'ALL IN!', loginDiv: true, loginErr: true, country: countryList, active: {index: true} });
            else {
                req.session.user = user.get({plain : true});
                res.redirect('/profile');
            }
        }
    })
});

/* LogginOut */
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

/* Register */
router.post('/register', function (req, res) {
    // validar informacao
    var newUser = createUser(req);
    newUser.save();

    console.log('user adicionado');
    res.redirect('/')
});



/* Criação de Utilizador na db */
function createUser(req) {
    return User.build({
        username : req.body.username,   email       : req.body.email,
        pwd      : bcrypt.hashSync(req.body.pwd, 10),
        firstname: req.body.firstname,
        lastname : req.body.lastname,   birthday    : req.body.birthday,
        gender   : req.body.gender,     country     : req.body.country,
        city     : req.body.city,       district    : req.body.district
    });
}

/* Check free username */
router.get('/checkFreeUser/:username', function (req, res) {
    console.log('body: ' + req.params.username);
    User.find({ where: { username: req.params.username }}).then(function (user) {
        if (user === null) {
            console.log('Username free');
            res.json({'freeUser': true});
        }
        else {
            //retorna so info sobre o user
            console.log(user.get({plain : true}));
            res.json({'freeUser': false});
        }
    });
});

/* Check free email */
router.get('/checkFreeEmail/:email', function (req, res) {
    console.log('body: ' + req.params.email);
    User.findOne({ where: { email: req.params.email }}).then(function (user) {
        if (user === null) {
            console.log('Email free');
            res.json({'freeUser': true});
        }
        else {
            //retorna so info sobre o user
            console.log(user.get({plain : true}));
            res.json({'freeEmail': false});
        }
    });
});


module.exports = router;
