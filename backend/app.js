var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var loginController = require('./controller/user/LoginController')
var logoutController = require('./controller/user/LogoutController')

//소켓 서버 생성
var socketServer = require('./modules/socketServer')
socketServer.socketServer.listen(9000);

var app = express();


//dotenv의 config()가 호출되면 '.env'파일의 설정값들이 process.env에 저장됨.
//이후 process.env.COOKIE_SECRET 처럼 설정값들을 사용할 수 있음.
require('dotenv').config();

var session = require('express-session');
/*app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: cookieParser(),
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));*/


app.use(require('connect-history-api-fallback')());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(''));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/loginCheck', loginController);
//app.use('/users',require('./controller/user'));
app.use('/auth',require('./controller/auth/auth.controller'));

app.use('/logout', logoutController);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
