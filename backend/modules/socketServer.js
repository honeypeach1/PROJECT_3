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
