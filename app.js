var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser')
var io = require('socket.io')
var session = require('express-session');
require('dotenv').config();


var app = express();
app.io = io();
app.io.set('origins', '*:*');


// middle app express
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create session
createSession = () =>  {
  return function (req, res, next) {
    if (!req.session.login) {
      req.session.login = 'logout';
		}
		next();
	};
};
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 600000 },
}));
app.use(createSession());


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var problemsRouter = require('./routes/problems');
var adminProblemsRouter = require('./routes/admin/problems');


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/problems', problemsRouter);
// app.use('/projects', projectsRouter);
app.use('/admin/problems', adminProblemsRouter)

// projectsRouter.compile(app.io)

//Admin

// var adminProblemsRouter = require('./routes/admin/problems');
// app.use('/admin/problems', adminProblemsRouter)

// projectsRouter(app.io)

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
