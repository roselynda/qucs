var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing');
});

router.get('/dashboard', function(req, res, next){
	res.render('dashboard');
});

router.get('/experiment', function(req, res, next){
	res.render('experiment');
});

router.get('/settings', function(req, res, next){
	res.render('settings');
});

router.get('/register', function(req, res, next){
	res.render('register');
});

router.get('/selectplan', function(req, res, next){
	res.render('selectplan');
});

router.get('/signin', function(req, res, next){
	res.render('signin');
});

router.get('/forgetpassword', function(req, res, next){
	res.render('forgetpassword');
});

router.get('/upgradeplan', function(req, res, next){
	res.render('upgradeplan');
});

router.get('/results', function(req, res, next){
	res.render('results');
});

module.exports = router;
