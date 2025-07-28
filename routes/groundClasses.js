
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());
router.use(roleAuthorization(["ADMIN"]));


router.get("/get", [checkDataExisting(["commune", "district", "province"])], async (req, res) => {
    const {commune, district, province} = req.query;
    try {
        const [result] = await connection.execute("SELECT k.* FROM klasy_gruntu k INNER JOIN lokalizacje l on k.ID_lokalizacji=l.ID WHERE l.gmina = ? AND l.powiat = ? AND l.wojewodztwo = ?", [commune, district, province]);
        res.status(200).json({success:true, message:`pobrano klasy gruntu dla ${commune}, ${district}, ${province}`, data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/update", [checkDataExisting(["ID_ground_class", "ground_class", "converter", "tax"])], async (req, res) => {
    const {ID_ground_class, ground_class, tax, converter} = req.body;
    try {
        const [result] = await connection.execute("UPDATE klasy_gruntu SET klasa = ?, podatek_za_hektar = ?, przelicznik = ? where ID = ?", [ground_class, tax, converter, ID_ground_class]);
        res.status(200).json({success:true, message:"rekord został zaktualizowany"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/insert", [checkDataExisting(["ground_class", "commune", "district", "province", "converter", "tax"])], async (req, res) => {
    const {ground_class, commune, district, province, converter, tax} = req.body;
    let localizationID;
    try {
        const [result] = await connection.execute("SELECT ID FROM lokalizacje where gmina = ? AND powiat = ? AND wojewodztwo = ? limit 1", [commune, district, province]);
        if(result.length > 0) {
            localizationID = result[0].ID;
        } else {
            const [result] = await connection.execute("INSERT INTO lokalizacje() VALUES(NULL, ?, ?, ?)", [province, district, commune]);
            localizationID = result.insertId;
        }
        await connection.execute("INSERT INTO klasy_gruntu() VALUES(NULL, ?, ?, ?, ?)", [ground_class, localizationID, converter, tax]);
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