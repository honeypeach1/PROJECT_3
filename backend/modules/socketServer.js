//장비, 웹 서버간 통신 소켓 서버 구축
var net = require('net')

const {Logger, Value} = require("sass");
const socketDB = require("./socketInsert");
const inputJson = require("./averageJson");
const {request} = require("express");
const {Socket} = require("net");
let remoteData = "";

/*서버 실행 시간*/
function timestamp() {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    console.log('소켓 데이터 받은 시간 : ' + today.toISOString().replace('T', ' ').substring(0, 19));
    return today.toISOString().replace('T', ' ').substring(0, 19);
}

exports.socketServer = net.createServer(function (socket) {
    console.log("socket server created.")

    //Received client address information.
    const remoteIp = socket.remoteAddress;
    const remotePort = socket.remotePort;
    //Check for Client Socket Information.
    console.log("Client IP : " + remoteIp + ", Client Port : " + remotePort)
    console.log("Express Server Booting Time : ", serverStartTime)
    /*
        서버 to 장비 tcp/ip 소켓 통신 설명

        tcp/ip 서버는 하나의 포트를 가지고 상시 listen상태로 구성한다.
        해당 서버로 통신하기 위한 장비는 연결하기 위한 tcp/ip 서버 아이피와 포트로 연결 요청한다.
        상시 오픈 상태의 tcp/ip서버는 연결받기 위한 장비로 부터 연결이 되고,
        장비에서 정해진 형태의 데이터 로우를 송신한다.(기본 송신 주기 30초)
        성공적으로 데이터를 받았음을 서버에서 $GSD를 SENDING한다.
        서버의 포트를 닫는다.

        만약 장비로 원격 명령을 보낼때는 서버로 부터 연결 요청이 왔을때, $GSD를 송신하는것이 아니라,
        $RS~~ 와 같은 채취 명령을 송신한다.
     */

    //tcp/ip 소켓 서버 구성시 서버단에서 연결 장비(클라이언트)로 보내야 하는 기본 명령어
    //but 소켓 연결이 들어오기전에 원격 명령을 내릴시, 해당 원격 명령을 가지고 있다가 소켓 연결 들어오면 write해야함.
    const returnData = "$GSD\r\n";

    //받은 원격 명령 할당(로컬화)
    //remoteData = "";
    //소켓 통신전 원격 명령을 받았다면, 전역 변수를 가져와서 null여부를 체크한다.
    if (remoteData != "") {
        socket.write(remoteData);
    } else {
        socket.write(returnData);
    }

    let buffer = new Uint8Array([]);

    socket.on('data', async function (chunk) {
        //소켓 서버에서 응답 request 전송전 받는 데이터 리스트를 하나의 로우로 만들기 위한 buff 처리
        buffer = Uint8Array.from([...buffer, ...chunk])
        buffer = new Uint8Array(buffer)
        buffer = Buffer.from(buffer);

        //console.log('Client received data : ',chunk.toString())
        //chunk.toString();
    })
    socket.on('end', function () {
        console.log('Socket Server ended.')
    })
    socket.on('listening', function () {
        console.log("Socket Server is listening.")
    })
    socket.on('close', function () {
        //로컬 변수 remoteData(원격 명령 처리 변수) 초기화
        remoteData = "";

        /*      받은 TCP/IP String 데이터 가공  영역       */
        //(, 탭) 제거
        let removeTabArray = buffer.toString().split((/,|\t/));
        //null 제거
        let removeNullArray = removeTabArray.filter(Boolean);
        /***********************************************************/

        //TCP/IP RECEIVE 스트링 데이터 중 AND 라는 컬럼 까지, 즉 AND 이전까지만 배열화 - 필요에 따라 그 이후로 기준을 정해 처리할 것.
        let makeDataArray = removeNullArray.slice(0, removeNullArray.indexOf('AND'));
        let averageDataJson = removeNullArray.slice(0, removeNullArray.indexOf('AND'));
        //시간 정보가 없어서 받은 시간 정보 함께 PUSH
        //평균값을 계산하기 위한 배열 변수
        averageDataJson.push("time");
        averageDataJson.push(timestamp());
        //추가로 장비 타입 번호도 구별 해야함. -> 즉, 1번은 악취, 2번은 채취, 3번은 분석
        const rand_2_5 = Math.floor(Math.random() * 4) + 2;
        averageDataJson.push("absoluteId")
        averageDataJson.push(rand_2_5)
        //하지만 현재 테스트용으로 AMS제품군으로만 분류로 할것이기 때문에 별도 처리하지 않음.
        //평균 값 계산
        inputJson.inputDataJson(averageDataJson);

        //arr[and 이전까지의 총 배열 갯수 나누기 2][2개 -> 물질 명, 물질 데이터](빈 배열 생성) -> 2차원 배열화  [ 'TOD', '1.35' ],[ 'SS1', '1.00' ],[ 'OTT', '19.55' ],,,,
        //const arr = Array.from(Array((makeDataArray.length) / 2), () => new Array(2));
        var socketJson = new Object();
        //악취 센서 또는 기상 데이터는 정해져 있기 떄문에 json 하드코딩 조건문 처리
        for (let i = 0; i < makeDataArray.length; i++) {
            if (i % 2 == 0) {
                if (makeDataArray[i] == 'TOD') {
                    socketJson.sensor_signal_data_tod = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'SS1' || makeDataArray[i] == 'SS2') {
                    socketJson.sensor_signal_data_mos = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'TH1' || makeDataArray[i] == 'TH2' || makeDataArray[i] == 'TH3') {
                    socketJson.sensor_signal_data_h2s = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'TN1' || makeDataArray[i] == 'TN2' || makeDataArray[i] == 'TN3') {
                    socketJson.sensor_signal_data_nh3 = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'TV1' || makeDataArray[i] == 'TV2' || makeDataArray[i] == 'TV3') {
                    socketJson.sensor_signal_data_voc = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'OTT') {
                    socketJson.sensor_signal_data_ott = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'OTH') {
                    socketJson.sensor_signal_data_oth = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'OWD') {
                    socketJson.sensor_signal_data_owd = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'OWS') {
                    socketJson.sensor_signal_data_ows = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'ITT') {
                    socketJson.sensor_signal_data_itt = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'BTV') {
                    socketJson.sensor_signal_data_btv = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'VSD') {
                    socketJson.sensor_signal_data_vsd = makeDataArray[i + 1];
                } else if (makeDataArray[i] == 'PSD') {
                    socketJson.sensor_signal_data_psd = makeDataArray[i + 1];
                }
            }
            JSON.stringify(socketJson);
        }
        //TCP/IP Receive 데이터 저장 쿼리 실행
        socketDB.socketInsert(socketJson);
        console.log("Socket Server closed.\n")
    })
})

//클라이언트 소켓 전송 데이터 형식
/*
TOD     0.0     MOS     2.0
TV1     1.0     TH1     0.0     TN1     0.0     OTT     6.00    OTH     22.60   OWD     11.00   OWS     0.40    OTP     1028.30 ITT     20.40   BTV     13.2
8       BTI     0.27    BTT     19.50   SOC     255.00  VSD     0.00    PSD     0       AND     0.00,0/10/,0.0000/5.0000/,0.04,1/2/3/10/15/30/50/300/1000/0/,0.0000/0.0300/1.0000/1.
5000/2.0000/3.5000/4.0000/4.5000/4.9990/5.0000/,0.06,0/500/550/1000/1050/50000/0/0/0/0/,0.0800/0.1714/0.1740/0.1927/0.1941/3.1999/3.2000/3.2000/3.2000/3.2000/,0.32,0/50/500/550/1000/1050/3000/0/0/,0.3850/0.5000/0.6073/0.6242/1.1229/1.1360/4.9999/5.0000/5.0000/,0.78,0/5
0/200/500/1000/1
050/100000/0/,1.0800/1.1000/1.1200/1.1222/1.1710/1.1730/4.9990/5.0000/, HOU     2,0,0,0,13.28,0,0,0,0,0.00,0,0,0,0,0.00,0,0,0,  RSS     0       RSST    0  RSSENDT  0       AUTO    0       WORKING 0       SSS     0       ERROR   0

*/
/*
var clientSocketDataRow = [
  {
    "TOD": 0,0,
    "MOS": 2.0
  },
  {
  "TV1": 1.0,
  "TH1": 0.0,
  "TN1": 0.0,
  "OTT": 7.70,
  "OTH": 20.05,
  "OWD": 11.00,
  "OWS": 0.60,
  "OTP": 1027.90,
  "ITT": 21.00,
  "BTV": 13.59,
  "BTI": 2,
  "BTT": 18.00,
  "SOC": 255.00,
  "VSD": 0.00,
  "PSD": 0
    },
  //AND로 구분
  {
    0.00,
    0/10/,
    0.0000/5.0000/,
    0.04,
    1/2/3/10/15/30/50/300/1000/0/,
    0.0000/0.0300/1.0000/1.5000/2.0000/3.5000/4.0000/4.5000/4.9990/5.0000/,
    0.06,
    0/500/550/1000/1050/50000/0/0/0/0/,
    0.0800/0.1714/0.1740/0.1927/0.1941/3.1999/3.2000/3.2000/3.2000/3.2000/,
    0.33,0/50/500/550/1000/1050/3000/0/0/,
    0.3850/0.5000/0.6073/0.6242/1.1229/1.1360/4.9999/5.0000/5.0000/,
    0.77,0/5
  },
 {
   0/200/500/1000/1
 },
  {
      050/100000/0/,
      1.0800/1.1000/1.1200/1.1222/1.1710/1.1730/4.9990/5.0000/,
      "HOU":2,0,0,0,13.59,0,0,0,0,0.00,0,0,0,0,0.00,0,0,0,
      "RSS":0,
      "RSST":0,
      "RSSE":0,
      "AUTO":0,
      "WORKING":0,
      "SSS":0,
      "ERROR":0
  }
]
*/

