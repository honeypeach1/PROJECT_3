//데이터 베이스 기본 설정
/*exports.mariaConfig = {
    host: '210.100.200.139',
    port: 3307,
    user: 'root',
    password: '035286',
    database: 'acen'
}*/

const mariaDB = require('maria');

let mariaConfig = {
    host: '210.100.200.139',
    port: 3307,
    user: 'root',
    password: '035286',
    database: 'acen',
    multipleStatements: true
}

let connection;
exports.dbconn = function handleDisconnect(connection) {
    connection = mariaDB.createConnection(mariaConfig);
    console.log("Try to connect MariaDB")
    connection.connect(function (err) {
        if (err) {
            console.log('err : ', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('MariaDB has success to connection.');
        }
        connection.on('error', function (err) {
            console.log('MariaDB Error : ', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                connection.destroy();
                handleDisconnect(connection);
            } else if(err.code === 'ECONNRESET') {
                connection.destroy();
                handleDisconnect(connection);
            } else if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
                handleDisconnect(connection);
            } else {
                throw err;
            }
        });
    })
    return connection;
}