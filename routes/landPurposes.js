
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.use(authorization());
router.use(roleAuthorization(["ADMIN"]));

router.get("/get", (req, res) => {
    connection.query("SELECT * FROM przeznaczenia_dzialek", (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"pobrano przeznaczenia działek", data:dataSanitizer(result)})
    })
});

router.post("/update", [checkDataExisting(["ID_land_purpose", "type"])], (req, res) => {
    const {ID_land_purpose, type} = req.body;
    connection.query("UPDATE przeznaczenia_dzialek SET typ = ? WHERE ID = ?", [type, ID_land_purpose], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    })
})

router.post("/delete", [checkDataExisting(["ID_land_purpose"])], (req, res) => {
    const {ID_land_purpose} = req.body;
    connection.query("DELETE FROM przeznaczenia_dzialek where ID = ?", [ID_land_purpose], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    })
})
router.post("/insert", [checkDataExisting(["type"])], (req, res) => {
    const {type} = req.body;
    connection.query("INSERT INTO przeznaczenia_dzialek() values(NULL, ?)", [type], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"dodano pomyślnie"})
    })
})

module.exports = router;