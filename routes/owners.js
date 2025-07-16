
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get_all", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT * FROM wlasciciele order by nazwisko");
        res.status(200).json({success:true, message:"pobrano dane wlascicieli", data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.get("/get", [checkDataExisting(["name_filter", "surname_filter"])], async (req, res) => {
    const {name_filter, surname_filter} = req.body;
    try {
        const [result] = await connection.execute("SELECT * FROM wlasciciele WHERE imie LIKE ? AND surname LIKE ?", [`%${name_filter}`, `%${surname_filter}`]);
        res.status(200).json({success:true, message:"pobrano włascicieli",data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/update", [checkDataExisting(["ID_owner", "name", "surname", "phone"])], async (req, res) => {
    const {ID_owner, name, surname, phone} = req.body;
    try {
        const [result] = await connection.execute("UPDATE wlasciciele SET imie = ?, nazwisko = ?, telefon = ? WHERE ID = ?", [name, surname, phone, ID_owner]);
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/insert", [checkDataExisting(["name", "surname", "phone"])], async (req, res) => {
    const {name, surname, phone} = req.body;
    try {
        const [result] = await connection.execute("INSERT INTO wlasciciele() VALUES(NULL, ?, ?, ?)", [name, surname, phone]);
        res.status(200).json({success:true, message:"dodano pomyślnie", insertID:result.insertId})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/delete", [roleAuthorization(["ADMIN"]), checkDataExisting(["ID_owner"])], async (req, res) => {
    const {ID_owner} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM wlasciciele WHERE ID = ?", [ID_owner]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;