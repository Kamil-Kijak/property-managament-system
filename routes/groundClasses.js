
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.use(authorization());

router.get("/get", [roleAuthorization(["ADMIN", "KSIEGOWOSC"])], (req, res) => {
    connection.query("SELECT * FROM klasy_gruntu", (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"pobrano klasy gruntu", data:dataSanitizer(result)})
    })
})

router.post("/update", [roleAuthorization(["ADMIN", "KSIEGOWOSC"]) ,checkDataExisting(["ID_ground_class", "ground_class", "tax"])], (req, res) => {
    const {ID_ground_class, ground_class, tax} = req.body;
    connection.query("UPDATE klasy_grountu SET klasa = ?, podatek_za_hektar = ? where ID = ?", [ground_class, tax, ID_ground_class], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"rekord został zaktualizowany"})
    })
});

router.post("/delete", [roleAuthorization(["ADMIN"]), checkDataExisting(["ID_ground_class"])], (req, res) => {
    const {ID_ground_class} = req.body;
    connection.query("DELETE FROM klasy_gruntu WHERE ID = ?", [ID_ground_class], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({
            success:true,
            message:"usunięto pomyślnie",
        })
    })
})
module.exports = router;