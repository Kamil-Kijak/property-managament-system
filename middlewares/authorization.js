
const jwt = require("jsonwebtoken")

const authorization = () => {
    const createAccessToken = (req, res, next) => {
        if(req.cookies["REFRESH_TOKEN"]) {
            try {
                const decoded = jwt.verify(req.cookies["REFRESH_TOKEN"], process.env.REFRESH_TOKEN_KEY || "inWhm0r9gfwJ_s07KEYrX");
                const { exp, ...safePayload } = decoded;
                const accessToken = jwt.sign(safePayload, process.env.ACCESS_TOKEN_KEY || "K1BjP6-xTEAS8uKoq1vNm", {
                    expiresIn:"10m"
                })
                res.cookie("ACCESS_TOKEN", accessToken, {
                    maxAge:1000*60*10,
                    httpOnly:true,
                    secure:false
                });
                req.user = decoded
                next();
            } catch (err) {
                console.log(err);
                res.status(403).json({requestRelogin:true, error:"Dostęp nieupoważniony"})
            }
        } else {
            res.status(403).json({requestRelogin:true, error:"Dostęp nieupoważniony"})
        }
    }
    return (req, res, next) => {
        if(req.cookies["ACCESS_TOKEN"]) {
            try {
                const decoded = jwt.verify(req.cookies["ACCESS_TOKEN"], process.env.ACCESS_TOKEN_KEY || "K1BjP6-xTEAS8uKoq1vNm");
                req.user = decoded
                next()
            } catch(err) {
               createAccessToken(req, res, next);
            }
        } else {
            createAccessToken(req, res, next);
        }
    }
}
module.exports = authorization;