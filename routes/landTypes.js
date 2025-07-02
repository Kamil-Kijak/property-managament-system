
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
    connection.query("SELECT * FROM rodzaje_działek", (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"pobrano rodzaje działek", data:dataSanitizer(result)})
    })
});

router.post("/update", [checkDataExisting(["ID_land_type", "name"])], (req, res) => {
    const {ID_land_type, name} = req.body;
    connection.query("UPDATE rodzaje_dzialek SET nazwa = ? WHERE ID = ?", [name, ID_land_type], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    })
})

router.post("/delete", [checkDataExisting(["ID_land_type"])], (req, res) => {
    const {ID_land_type} = req.body;
    connection.query("DELETE FROM rodzaje_dzialek where ID = ?", [ID_land_type], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    })
})
router.post("/insert", [checkDataExisting(["name"])], (req, res) => {
    const {name} = req.body;
    connection.query("INSERT INTO rodzaje_dzialek() values(NULL, ?)", [name], (err, result) => {
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