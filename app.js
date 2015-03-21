var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

// var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var authConfig = require("./oauth2-config.js");

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
// var GOOGLE_CLIENT_ID = authConfig.client_id;
// var GOOGLE_CLIENT_SECRET = authConfig.client_secret;

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing. However, since this example does not
// have a database of user records, the complete Google profile is
// serialized and deserialized.
// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function(obj, done) {
//     done(null, obj);
// });

// Use the GoogleStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and Google
// profile), and invoke a callback with a user object.
// passport.use(new GoogleStrategy({
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://127.0.0.1:3000/auth/google/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//         // asynchronous verification, for effect...
//         console.log('accessToken');
//         console.log(accessToken);
//         process.nextTick(function () {
//             // To keep the example simple, the user's Google profile is returned to
//             // represent the logged-in user. In a typical application, you would want
//             // to associate the Google account with a user record in your database,
//             // and return that user instead.
//             return done(null, profile);
//        });
//     }
// ));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err)
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
