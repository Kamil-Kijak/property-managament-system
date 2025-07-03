
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.use(authorization());

router.get("/get", [roleAuthorization(["ADMIN", "KSIEGOWOSC"]), checkDataExisting(["comune", "disctrict", "province"])], (req, res) => {
    const {comune, disctrict, province} = req.body;
    connection.query("SELECT k.* FROM klasy_gruntu k INNER JOIN lokalizacje l on k.ID_lokalizacji=l.ID WHERE l.gmina = ? AND l.powiat = ? AND l.wojewodztwo = ?",
        [comune, disctrict, province] ,(err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:`pobrano klasy gruntu dla ${comune}, ${disctrict}, ${province}`, data:dataSanitizer(result)})
    })
})

router.post("/update", [roleAuthorization(["ADMIN", "KSIEGOWOSC"]) ,checkDataExisting(["ID_ground_class", "ground_class", "converter", "tax"])], (req, res) => {
    const {ID_ground_class, ground_class, tax, converter} = req.body;
    connection.query("UPDATE klasy_grountu SET klasa = ?, podatek_za_hektar = ?, converter = ? where ID = ?", [ground_class, tax, converter, ID_ground_class], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"rekord został zaktualizowany"})
    })
});

router.post("/insert", [roleAuthorization(["ADMIN"]), checkDataExisting(["ground_class", "comune", "disctrict", "province", "converter", "tax"])], (req, res) => {
    const {ground_class, comune, disctrict, province, converter, tax} = req.body;
    let localizationID;
    connection.query("SELECT ID FROM lokalizacje where comune = ?, disctrict = ?, province = ? limit 1", [comune, disctrict, province], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        if(result.length > 0) {
            localizationID = result[0].ID;
        } else {
            connection.query("INSERT INTO lokalizacje() VALUES(NULL, ?, ?, ?)", [province, disctrict, comune], (err, result) => {
                 if(err) {
                    return res.status(500).json({
                        error:"bład bazy danych",
                        errorInfo:err
                    })
                }
                localizationID = result.insertId;
            })
        }
        connection.query("INSERT INTO klasy_gruntu() VALUES(NULL, ?, ?, ?, ?)", [ground_class, localizationID, converter, tax], (err, result) => {
            if(err) {
                return res.status(500).json({
                    error:"bład bazy danych",
                    errorInfo:err
                })
            }
            res.status(200).json({success:true, message:"wstawiono nowy rekord"})
        })
    })
})

module.exports = router;