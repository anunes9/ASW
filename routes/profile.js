var express = require('express');
var router  = express.Router();

/* Profile Page */
router.get('/', function (req, res) {
    if (!req.session.user)
        return res.render('profile' ,{ title: 'ALL IN!', loginDiv: true, active: {profile: true}});
    else {
    	req.session.user.birthday = req.session.user.birthday.substring(0,10);
        return res.render('profile', { title: 'ALL IN!', user: req.session.user, active: {profile: true} });
    }
});


module.exports = router;