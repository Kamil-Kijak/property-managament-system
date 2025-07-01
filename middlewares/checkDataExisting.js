const checkDataExisting = (requiredFields) => {
    return (req, res, next) => {
        if(req.body) {
            const missing = requiredFields.filter(field => !req.body[field]);
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