
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());


router.get("/check_count", [checkDataExisting(["ground_class", "tax_district"])], async (req, res) => {
    const {ground_class, tax_district} = req.query;
    try {
        const [result] = await connection.execute("SELECT COUNT(ID) as count FROM klasy_gruntu WHERE klasa = ? AND okreg_podatkowy = ?", [ground_class, tax_district]);
        res.status(200).json({success:true, data:result[0]});
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.get("/get_unique_classes", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT DISTINCT klasa FROM klasy_gruntu");
        res.status(200).json({success:true, data:result});
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.get("/get", [checkDataExisting(["tax_district"])], async (req, res) => {
    const {tax_district} = req.query;
    try {
        const [result] = await connection.execute("SELECT k.klasa, k.przelicznik, k.podatek, k.ID FROM klasy_gruntu k WHERE k.okreg_podatkowy = ? ORDER BY k.klasa", [tax_district]);
        res.status(200).json({success:true, message:`pobrano klasy gruntu dla okręgu ${tax_district}`, data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.get("/get_land_classes", [checkDataExisting(["ID_land"])], async (req, res) => {
    const {ID_land} = req.query;
    try {
        const [result] = await connection.execute("SELECT k.ID, k.klasa, k.przelicznik FROM klasy_gruntu k INNER JOIN lokalizacje l on k.okreg_podatkowy=l.okreg_podatkowy INNER JOIN miejscowosci m on m.ID_lokalizacji=l.ID INNER JOIN dzialki d on d.ID_miejscowosci=m.ID WHERE d.ID = ? ORDER BY k.klasa", [ID_land]);
        res.status(200).json({success:true, message:`pobrano klasy gruntu dla dzialki ${ID_land}`, data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.use(roleAuthorization(["KSIEGOWOSC", "SEKRETARIAT"]));

router.post("/update", [checkDataExisting(["ID_ground_class", "ground_class", "converter", "tax"])], async (req, res) => {
    const {ID_ground_class, ground_class, converter, tax} = req.body;
    try {
        await connection.execute("UPDATE klasy_gruntu SET klasa = ?, przelicznik = ?, podatek = ? where ID = ?", [ground_class, converter, tax, ID_ground_class]);
        res.status(200).json({success:true, message:"rekord został zaktualizowany"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});


router.post("/insert", [checkDataExisting(["ground_class", "converter", "tax_district", "tax"])], async (req, res) => {
    const {ground_class, converter, tax_district, tax} = req.body;
    try {
        await connection.execute("INSERT INTO klasy_gruntu() VALUES(NULL, ?, ?, ?, ?)", [ground_class, converter, tax_district, tax]);
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