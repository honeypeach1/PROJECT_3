const crypto = require("crypto");

//단방향 salt 암호화(비동기) - 내부 절차가 처리되고 나서 동작
exports.CRYPTO = async (param) =>
    new Promise((resolve,reject) => {
        const salt = crypto.randomBytes(64).toString('base64');
        let result = '';
        crypto.pbkdf2(param, salt, 100000,64,'sha512',(err,key) => {
            if(err) return reject(err);
            result = key.toString('base64');
            return resolve({pwd:result,salt});
        });
    })

//단방향 salt 암호화(동기) - pbkdf2 처리 반복 횟수(100000) 대략 1초대로 처리전 리턴이 되어 null로 나옴.
/*
exports.CRYPTO = function (param) {
    const salt = crypto.randomBytes(64).toString('base64');
    let result = '';
    crypto.pbkdf2(param, salt, 100000,64,'sha512',(err, key) => {
        if (err) return reject(err);
        result = key.toString('base64');
        return ({pwd: result, salt});
    });
}*/

//단방향 salt 복호화(비동기)
/*exports.DECRYPTO = async (pass,salt) =>
    new Promise((resolve,reject) => {
        return {salt : crypto.pbkdf2Sync(pass,salt,100000,64,'sha512').toString('base64')};
    })*/

//단방향 salt 복호화(동기)
exports.DECRYPTO = (pass,salt) => {
    return {salt : crypto.pbkdf2Sync(pass,salt,100000,64,'sha512').toString('base64')};
}