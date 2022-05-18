const jwt = require('../modules/jwt');
const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const util = require('../modules/util');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => {
        // var token = req.headers.token;
        try {
            var token = req.cookies['x-auth'].token;
            // 토큰 없음
            if (!token)
                return res.json(util.successFalse(CODE.BAD_REQUEST, MSG.EMPTY_TOKEN));
            // decode
            const user = await jwt.verify(token);
            // 유효기간 만료
            if (user === TOKEN_EXPIRED)
                return res.json(util.successFalse(CODE.UNAUTHORIZED, MSG.EXPIRED_TOKEN));
            // 유효하지 않는 토큰
            if (user === TOKEN_INVALID)
                return res.json(util.successFalse(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
            if (user.MEMBER_ID === undefined)
                return res.json(util.successFalse(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
            req.MEMBER_ID = user.MEMBER_ID;
            //토큰 검증이 정상적으로 처리되면 다음 미들웨어로 넘어간다.
            next();
        } catch (err) {
            return res.json(util.successFalse(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
        }
    }
}

module.exports = authUtil;