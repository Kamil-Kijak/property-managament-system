
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
        const [result] = await connection.execute("SELECT * FROM plany_ogolne order by kod");
        res.status(200).json({success:true, message:"pobrano plany ogólne", data:dataSanitizer(result)})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.use(roleAuthorization(["ADMIN"]));

router.post("/update", [checkDataExisting(["ID_general_plan", "code", "description"])], async (req, res) => {
    const {ID_general_plan, code, description} = req.body;
    try {
        const [result] = await connection.execute("UPDATE plany_ogolne SET kod = ?, opis = ? WHERE ID = ?", [code, description, ID_general_plan]);
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/delete", [checkDataExisting(["ID_general_plan"])], async (req, res) => {
    const {ID_general_plan} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM plany_ogolne where ID = ?", [ID_general_plan]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/insert", [checkDataExisting(["code", "description"])], async (req, res) => {
    const {code, description} = req.body;
    try {
        const [result] = await connection.execute("INSERT INTO plany_ogolne() values(NULL, ?, ?)", [code, description]);
        res.status(200).json({success:true, message:"dodano pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;