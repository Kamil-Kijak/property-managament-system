
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());
router.use(roleAuthorization(["ADMIN"]));


router.get("/get", [checkDataExisting(["tax_district"])], async (req, res) => {
    const {tax_district} = req.query;
    try {
        const [result] = await connection.execute("SELECT k.klasa, k.przelicznik, k.ID FROM klasy_gruntu k WHERE k.okreg_podatkowy = ?", [tax_district]);
        res.status(200).json({success:true, message:`pobrano klasy gruntu dla okręgu ${tax_district}`, data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/update", [checkDataExisting(["ID_ground_class", "ground_class", "converter"])], async (req, res) => {
    const {ID_ground_class, ground_class, converter} = req.body;
    try {
        await connection.execute("UPDATE klasy_gruntu SET klasa = ?, przelicznik = ? where ID = ?", [ground_class, converter, ID_ground_class]);
        res.status(200).json({success:true, message:"rekord został zaktualizowany"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});


router.post("/insert", [checkDataExisting(["ground_class", "converter", "tax_district"])], async (req, res) => {
    const {ground_class, converter, tax_district} = req.body;
    try {
        await connection.execute("INSERT INTO klasy_gruntu() VALUES(NULL, ?, ?, ?)", [ground_class, converter, tax_district]);
        res.status(200).json({success:true, message:"wstawiono nowy rekord"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/delete", [checkDataExisting(["ID_ground_class"])], async (req, res) => {
    const {ID_ground_class} = req.body;
    try {
        await connection.execute("DELETE FROM klasy_gruntu WHERE ID = ?", [ID_ground_class]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;