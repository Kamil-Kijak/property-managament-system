


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
        const [result] = await connection.execute("SELECT * FROM mpzp order by kod");
        res.status(200).json({success:true, message:"pobrano MPZP", data:dataSanitizer(result)})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.use(roleAuthorization(["ADMIN"]));

router.post("/update", [checkDataExisting(["ID_mpzp", "code", "description"])], async (req, res) => {
    const {ID_mpzp, code, description} = req.body;
    try {
        const [result] = await connection.execute("UPDATE mpzp SET kod = ?, opis = ? WHERE ID = ?", [code, description, ID_mpzp]);
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/delete", [checkDataExisting(["ID_mpzp"])], async (req, res) => {
    const {ID_mpzp} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM mpzp where ID = ?", [ID_mpzp]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/insert", [checkDataExisting(["code", "description"])], async (req, res) => {
    const {code, description} = req.body;
    try {
        const [result] = await connection.execute("INSERT INTO mpzp() values(NULL, ?, ?)", [code, description]);
        res.status(200).json({success:true, message:"dodano pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;