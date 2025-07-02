


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
    connection.query("SELECT * FROM mpzp", (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"pobrano MPZP", data:dataSanitizer(result)})
    })
});

router.post("/update", [checkDataExisting(["ID_mpzp", "code", "description"])], (req, res) => {
    const {ID_mpzp, code, description} = req.body;
    connection.query("UPDATE mpzp SET code = ?, description = ? WHERE ID = ?", [code, description, ID_mpzp], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    })
})

router.post("/delete", [checkDataExisting(["ID_mpzp"])], (req, res) => {
    const {ID_mpzp} = req.body;
    connection.query("DELETE FROM mpzp where ID = ?", [ID_mpzp], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    })
})

router.post("/insert", [checkDataExisting(["code", "description"])], (req, res) => {
    const {code, description} = req.body;
    connection.query("INSERT INTO mpzp() values(NULL, ?, ?)", [code, description], (err, result) => {
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