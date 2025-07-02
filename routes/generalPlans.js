
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
    connection.query("SELECT * FROM plany_ogolne", (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"pobrano plany ogólne", data:dataSanitizer(result)})
    })
});

router.post("/update", [checkDataExisting(["ID_general_plan", "code", "description"])], (req, res) => {
    const {ID_general_plan, code, description} = req.body;
    connection.query("UPDATE plany_ogolne SET code = ?, description = ? WHERE ID = ?", [code, description, ID_general_plan], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    })
})

router.post("/delete", [checkDataExisting(["ID_general_plan"])], (req, res) => {
    const {ID_general_plan} = req.body;
    connection.query("DELETE FROM plany_ogolne where ID = ?", [ID_general_plan], (err, result) => {
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
    connection.query("INSERT INTO plany_ogolne() values(NULL, ?, ?)", [code, description], (err, result) => {
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