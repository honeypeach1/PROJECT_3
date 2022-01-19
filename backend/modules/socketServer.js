//장비, 웹 서버간 통신 소켓 서버 구축
var net = require('net')

exports.socketServer = net.createServer(function (socket){
    console.log("socket server created.")

    //Received client address information.
    const remoteIp = socket.remoteAddress;
    const remotePort = socket.remotePort;
    //Check for Client Socket Information.
    console.log("Client IP : " + remoteIp + ", Client Port : " + remotePort)

    //tcp/ip 소켓 서버 구성시 서버단에서 연결 장비(클라이언트)로 보내야 하는 기본 명령어
    socket.write("$GSD\r\n")

    socket.on('data',function (chunk){
        console.log('Client received data : ',chunk.toString())
        chunk.toString();

        //데이터 처리&데이터베이스화 부분
        const dataRow = () => {
            return null;
        }
    })
    socket.on('end',function (){
        console.log('Socket Server ended.')
    })
    socket.on('listening',function (){
        console.log("Socket Server is listening.")
    })
    socket.on('close',function (){
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

