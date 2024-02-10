var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let expSessions = require('express-session');
let passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let flash = require('connect-flash');
var app = express();
app.set("view engine", "ejs");
app.use(flash());
app.use(expSessions({
    resave:false,
    saveUninitialized:false,
    secret: "hey hey",
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
