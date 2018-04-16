var express = require('express');
var Admin   = require('../config/admin_model');
var User    = require('../config/user_model');
var router  = express.Router();
var bcrypt  = require('bcryptjs');
var GameRequest = require('../config/game_request_model');

var countryList = ["Africa", "Albania", "Andorra", "Asia", "Australia", "Austria", "Belarus", "Belgium",
    "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland", "France",
    "Germany", "Gibraltar", "Greece", "Hungary", "Iceland", "Ireland", "Isle of Man", "Italy", "Kosovo", "Latvia",
    "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands",
    "North America", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia",
    "South America", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Russia"];

router.get('/', function(req, res, next) {
    if (req.session.user) {
    	req.session.destroy();
    	res.redirect('/admin');
    }
    else if(req.session.admin)
    	res.render('admin/admin', { title: 'ALL IN!', loginDiv: false, admin: req.session.admin, active: {index: true},
            cenas: req.session.admin.username, layout: '../views/admin/admin-layout.hbs', session: true, country: countryList});
    else
        res.render('admin/admin', { title: 'ALL IN!', loginDiv: true, active: {index: true},
            layout: '../views/admin/admin-layout.hbs'});
});

/* Loggin */
router.post('/login', function (req, res) {
    Admin.findOne({where: {username: req.body.admin}}).then(function (admin) {
        if (!admin) {
            res.render('admin/admin', { title: 'ALL IN!', loginErrPwd: true, loginDiv: true, active: {index: true},
                layout: '../views/admin/admin-layout.hbs'});
        }
        else {
            if(!bcrypt.compareSync(req.body.pwd, admin.get('pwd')))
                res.render('admin/admin', { title: 'ALL IN!', loginErrPwd: true, loginDiv: true,  active: {index: true},
                layout: '../views/admin/admin-layout.hbs'});
            else {
                req.session.admin = admin.get({plain : true});
                res.redirect('/admin');
            }
        }
    })
});

/* LogginOut */
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/admin');
});

//option1 - find by username or email
router.get('/optionONE', function (req, res) {
    console.log(req.query);
    if (req.query.email.length !== 0) {
        User.findOne({where: {email: req.query.email}}).then(function (user) {
            if (user)
                res.json({user: user.get({plain: true})});
            else
                res.json({});
        });
    }
    else {
        User.findOne({where: {username: req.query.username}}).then(function (user) {
            if (user)
                res.json({user: user.get({plain: true})});
            else
                res.json({});
        });
    }
});

//option2 - find by first name or last name
router.get('/optionTWO', function (req, res) {
    if (req.query.firstname.length !== 0 && req.query.lastname.length === 0)
        User.findAll({where: {firstname: req.query.firstname }}).then(function (user) {
            var allusers = []
            for (var i=0; i<user.length; i++)
                allusers.push(user[i].get({plain: true}));

            res.json({allusers: allusers});
        });
    else if (req.query.firstname.length === 0 && req.query.lastname.length !== 0)
        User.findAll({where: {lastname: req.query.lastname }}).then(function (user) {
            var allusers = []
            for (var i=0; i<user.length; i++)
                allusers.push(user[i].get({plain: true}));

            res.json({allusers: allusers});
        });
    else
        User.findAll({where: {firstname: req.query.firstname, lastname: req.query.lastname }}).then(function (user) {
            var allusers = []
            for (var i=0; i<user.length; i++)
                allusers.push(user[i].get({plain: true}));

            res.json({allusers: allusers});
        });
});

//option3 - find by gender
router.get('/optionTHREE', function (req, res) {
    User.findAll({where: {gender: req.query.gender }}).then(function (user) {
        var allusers = []
        for (var i=0; i<user.length; i++)
            allusers.push(user[i].get({plain: true}));

        res.json({allusers: allusers});
    });
});

//option4 - find by country, city or district
router.get('/optionFOUR', function (req, res) {
    console.log(req.query);
    if (req.query.country !== 'Portugal')
        User.findAll({where: {country: req.query.country }}).then(function (user) {
            var allusers = []
            for (var i=0; i<user.length; i++)
                allusers.push(user[i].get({plain: true}));

            res.json({allusers: allusers});
        });
    else if (req.query.country === 'Portugal' && req.query.city === 'Other')
        User.findAll({where: {country: req.query.country }}).then(function (user) {
            var allusers = []
            for (var i=0; i<user.length; i++)
                allusers.push(user[i].get({plain: true}));

            res.json({allusers: allusers});
        });
    else if (req.query.city !== 'Other')
        User.findAll({where: {city: req.query.city }}).then(function (user) {
            var allusers = []
            for (var i=0; i<user.length; i++)
                allusers.push(user[i].get({plain: true}));

            res.json({allusers: allusers});
        });
    else
        User.findAll({where: {city: req.query.city, district: req.query.district}}).then(function (user) {
            var allusers = []
            for (var i=0; i<user.length; i++)
                allusers.push(user[i].get({plain: true}));

            res.json({allusers: allusers});
        });
});

//option5 - find all games
router.get('/optionFIVE', function (req, res) {
    GameRequest.findAll({}).then(function (game) {
        var allgames = [];
        for (var i=0; i<game.length; i++)
            allgames.push(game[i].get({plain: true}));

        res.json({allgames: allgames});
    });
});

//option6 - find all games
router.get('/optionSIX', function (req, res) {
    console.log(req.query)
        if (req.query.gname != '') {
            console.log("procurar por name");
            GameRequest.findAll({where: {name: req.query.gname}}).then(function (game) {
                var allgames = [];
                for (var i = 0; i < game.length; i++)
                    allgames.push(game[i].get({plain: true}));

                console.log("Pronto a enviar", allgames);

                res.json({allgames: allgames});
            });

        }
    else if (req.query.gaid != '') {
            console.log("procurar por id");
            GameRequest.findAll({where: {id: req.query.gaid}}).then(function (game) {
                var allgames = [];
                for (var i = 0; i < game.length; i++)
                    allgames.push(game[i].get({plain: true}));

                console.log("Pronto a enviar", allgames);
                res.json({allgames: allgames});
            });
        }
    else if (req.query.gdesc != '') {
            console.log("procurar por desc");
            GameRequest.findAll({where: {description: req.query.gdesc}}).then(function (game) {
                var allgames = [];
                for (var i = 0; i < game.length; i++)
                    allgames.push(game[i].get({plain: true}));
                console.log("Pronto a enviar", allgames);
                res.json({allgames: allgames});
            });
        }

    else if (req.query.gcreator != '') {
            console.log("procurar por creator name");
            GameRequest.findAll({where: {ownerName: req.query.gcreator}}).then(function (game) {
                var allgames = [];
                for (var i = 0; i < game.length; i++)
                    allgames.push(game[i].get({plain: true}));

                console.log(allgames)

                res.json({allgames: allgames});
            });
        }
    else {
            GameRequest.findAll({}).then(function (game) {
                var allgames = [];
                for (var i=0; i<game.length; i++)
                    allgames.push(game[i].get({plain: true}));

                res.json({allgames: allgames});
            });
        }

});

router.post('/games', function(req, res){

    console.log('chequei aqui');

    GameRequest.findAll().then(function (r) {
        var allrooms = []
        for (var i=0; i<r.length; i++)
            allrooms.push(r[i].get({plain: true}));

        res.send({a: allrooms});
    });
});


module.exports = router;
