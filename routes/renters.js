
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.use(authorization());

router.get("/get", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT * FROM dzierzawcy", [ID_rent]);
        res.status(200).json({success:true, message:"pobrano dane", data:dataSanitizer(result)});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;