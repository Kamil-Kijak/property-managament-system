const checkDataExisting = (requiredFields) => {
    return (req, res, next) => {
        let requestObj;
        if(req.body) {
            requestObj = req.body;
        } else {
            requestObj = req.query;
        }
        if(requestObj) {
            const missing = requiredFields.filter(field => requestObj[field] == null);
            if(missing.length > 0) {
                return res.status(400).json({error:`missing fields: ${missing.join(", ")}`})
            } else {
                next();
            }
        } else {
            return res.status(400).json({error:`missing body`})
        }
    }
}

module.exports = checkDataExisting;