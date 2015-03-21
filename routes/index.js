var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Youtube List'
    });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About' });
});

module.exports = router;
