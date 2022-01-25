var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var csurf = require('csurf')
    , csrfProtection = csurf({cookie: true});
var passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routers/users');
var authRouter = require('./routers/auth');

//소켓 서버 생성
var socketServer = require('./modules/socketServer')
socketServer.socketServer.listen(9000);

var app = express();

app.use(cors({
  origin:'http://127.0.0.1:8080',
  credential:true,
}));

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

/*유저 처리 컨트롤러*/
app.use(cors());
app.use('/user', userRouter);
/*인증 처리 컨트롤러*/
app.use('/auth',authRouter);

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
