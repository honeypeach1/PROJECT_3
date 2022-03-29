var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var userRouter = require('./routers/users');
var authRouter = require('./routers/auth');
var staticRouter = require('./routers/static');
var monitorRouter = require('./routers/monitoring')
var initEquip = require('./controller/init/initController')

/*서버 실행 시간*/
var serverStart = new Date();
serverStart.setHours(serverStart.getHours() + 9);
const serverStartTime = serverStart.toISOString().replace('T', ' ').substring(0, 19);
global.serverStartTime = serverStartTime;
const arrayList = [];
global.arrayList = arrayList;

//소켓 서버 생성
var socketServer = require('./modules/socketServer');
/*
 처음 서버 실행시 동작하는 컨트롤러
 장비 리스트를 불러옴. port 컬럼을 가져와서 동적으로 포트를 만들기
*/
const equipment = () =>
    new Promise((resolve) => {
        resolve(initEquip.getEquipment());
    });
equipment().then((data) => {
    let dataList = [];
    console.log("data : ",data)
    if (data !== undefined) {
        data.forEach((port, num) => {
            //소켓 서버 동적 변수 생성
            dataList[num] = require('./modules/socketServer');
            dataList[num].socketServer.listen(port)
        });
    }
}).catch((err) => {
    console.log("장비 호출 에러 : ", err)
})
/*const equipment = async () => await initEquip.getEquipment();
console.log("equipment : ", equipment)*/

var app = express();
app.use(require('connect-history-api-fallback')());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//cors - 백엔드와 프론트엔드간 통신에서 Access-Control-Allow-Origin 오류 방지
app.use(cors({
    origin: true,     //데이터 요청시 orgin 헤더 포함, 즉 도메인의 형태를 모두 허용해줌.
    credential: true  //Access-Control-Allow-Origin 허용
}));

app.use(session({
    key: 'session_Key',       //세션의 키 값
    secret: 'secret',         //세션의 비밀 키, 쿠키값의 변조를 막기 위해서 이 값을 통해 세션을 암호화 하여 저장
    resave: false,            //세션을 항상 저장할 지 여부
    saveUninitialized: true,  //세션이 저장되기전에 uninitialize 상태로 만들어 저장
    cookie: {                 //쿠키 설정
        maxAge: 24000 * 60 * 60 //쿠키 유효기간 24시간
    }
}));
/*
  //세션을 관리하는 파일에 작성해야함. 추후 별도 세션 관리 페이지 생성시 상단에 추가하기
  axios.defaults.withCredentials = true
*/


app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

/*유저 처리 컨트롤러*/
app.use('/user', userRouter);
/*인증 처리 컨트롤러*/
app.use('/auth', authRouter);
/*통계 자료 컨트롤러*/
app.use('/static', staticRouter);
/*메인 악취 컨트롤러*/
app.use('/monitoring',monitorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
