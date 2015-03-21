var express = require('express');
var router = express.Router();
var passport = require('passport');


// GET /auth/google
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Google authentication will involve
// redirecting the user to google.com. After authorization, Google
// will redirect the user back to this application at /google/callback
router.get('/google',
// passport.authenticate('google', { scope: ['https://gdata.youtube.com'] }),
passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/youtube'
        ],
        redirect_uri: 'http://127.0.0.1:3000/auth/google/callback', 
        grant_type: 'authorization_code'
    }),
    function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
});

// GET /auth/google/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
