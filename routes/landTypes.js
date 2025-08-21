
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT * FROM rodzaje_dzialek");
        res.status(200).json({success:true, message:"pobrano rodzaje działek", data:result})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.use(roleAuthorization(["ADMIN"]));

router.post("/update", [checkDataExisting(["ID_land_type", "name"])], async (req, res) => {
    const {ID_land_type, name} = req.body;
    try {
        await connection.execute("UPDATE rodzaje_dzialek SET nazwa = ? WHERE ID = ?", [name, ID_land_type]);
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/delete", [checkDataExisting(["ID_land_type"])], async (req, res) => {
    const {ID_land_type} = req.body;
    try {
        await connection.execute("DELETE FROM rodzaje_dzialek where ID = ?", [ID_land_type]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/insert", [checkDataExisting(["name"])], async (req, res) => {
    const {name} = req.body;
    try {
        await connection.execute("INSERT INTO rodzaje_dzialek() values(NULL, ?)", [name]);
        res.status(200).json({success:true, message:"dodano pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/insert_many", [checkDataExisting(["data"])], async (req, res) => {
    const {data} = req.body;
    try {
        const [result] = await connection.execute("SELECT nazwa FROM rodzaje_dzialek");
        data.forEach(async (obj) => {
            if(!result.some((value) => obj == value.nazwa)) {
                await connection.execute("INSERT INTO rodzaje_dzialek() values(NULL, ?)", [obj]);
            }
        });
        res.status(200).json({success:true, message:"wstawiono rekordy"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

module.exports = router;