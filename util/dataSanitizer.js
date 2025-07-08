

const validator = require("validator");
const dataSanitizer = (data) => {
    return [...data].map((obj) => {
        const newObject = {};
        Object.keys(obj).forEach((key) => {
            newObject[key] = validator.escape(obj[key].toString());
        })
        return newObject;
    })
}
module.exports = dataSanitizer;