
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT * FROM przeznaczenia_dzialek");
        res.status(200).json({success:true, message:"pobrano przeznaczenia działek", data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.use(roleAuthorization(["ADMIN"]));

router.post("/update", [checkDataExisting(["ID_land_purpose", "type"])], async (req, res) => {
    const {ID_land_purpose, type} = req.body;
    try {
        const [result] = await connection.execute("UPDATE przeznaczenia_dzialek SET typ = ? WHERE ID = ?", [type, ID_land_purpose]);
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/delete", [checkDataExisting(["ID_land_purpose"])], async (req, res) => {
    const {ID_land_purpose} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM przeznaczenia_dzialek where ID = ?", [ID_land_purpose]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/insert", [checkDataExisting(["type"])], async (req, res) => {
    const {type} = req.body;
    try {
        const [result] = await connection.execute("INSERT INTO przeznaczenia_dzialek() values(NULL, ?)", [type]);
        res.status(200).json({success:true, message:"dodano pomyślnie"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;