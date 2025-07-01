
const validator = require("validator")
const sanitizeData = (req, res, next) => {
    if(req.body) {
        const sanitizedBody = {};
        Object.keys(req.body).forEach((key) => {
            sanitizedBody[key] = validator.escape(req.body[key]);
        })
        req.body = sanitizedBody;
    }
    next();
}
module.exports = sanitizeData;