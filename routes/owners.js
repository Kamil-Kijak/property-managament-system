
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.use(authorization());

router.get("/get_all", (req, res) => {
    connection.query("SELECT * FROM wlasciciele order by nazwisko", (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"pobrano dane wlascicieli", data:dataSanitizer(result)})
    })
});
router.get("/get", [checkDataExisting(["name_filter", "surname_filter"])], (req, res) => {
    const {name_filter, surname_filter} = req.body;
    connection.query("SELECT * FROM wlasciciele WHERE imie LIKE ? AND surname LIKE ?", [`%${name_filter}`, `%${surname_filter}`], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"pobrano włascicieli",data:dataSanitizer(result)})

    })
})

router.post("/update", [checkDataExisting(["ID_owner", "name", "surname", "phone"])], (req, res) => {
    const {ID_owner, name, surname, phone} = req.body;
    connection.query("UPDATE wlasciciele SET imie = ?, nazwisko = ?, telefon = ? WHERE ID = ?", [name, surname, phone, ID_owner], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    })
})

router.post("/insert", [checkDataExisting(["name", "surname", "phone"])], (req, res) => {
    const {name, surname, phone} = req.body;
    connection.query("INSERT INTO wlasciciele() VALUES(NULL, ?, ?, ?)", [name, surname, phone], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"dodano pomyślnie"})
    });
})
router.post("/delete", [roleAuthorization(["ADMIN"]), checkDataExisting(["ID_owner"])], (req, res) => {
    const {ID_owner} = req.body;
    connection.query("DELETE FROM wlasciciele WHERE ID = ?", [ID_owner], (err, result) => {
         if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    })
})

module.exports = router;