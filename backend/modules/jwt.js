const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/key').secretKey;
const options = require('../config/key').option;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async (dataList) => {
        const payload = {
            MEMBER_ID: dataList[0],
            MEMBER_NAME: dataList[1],
            MEMBER_RELES: dataList[2],
        };
        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: randToken.uid(256)
        };
        return result;
    },
    verify: async (token) => {
        let decoded;
        try {
            // verify를 통해 값 decode!
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}