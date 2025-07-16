
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get", [roleAuthorization(["KSIEGOWOSC"]), checkDataExisting(["comune", "disctrict", "province"])], async (req, res) => {
    const {comune, disctrict, province} = req.body;
    try {
        const [result] = await connection.execute("SELECT k.* FROM klasy_gruntu k INNER JOIN lokalizacje l on k.ID_lokalizacji=l.ID WHERE l.gmina = ? AND l.powiat = ? AND l.wojewodztwo = ?", [comune, disctrict, province]);
        res.status(200).json({success:true, message:`pobrano klasy gruntu dla ${comune}, ${disctrict}, ${province}`, data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/update", [roleAuthorization(["KSIEGOWOSC"]) ,checkDataExisting(["ID_ground_class", "ground_class", "converter", "tax"])], async (req, res) => {
    const {ID_ground_class, ground_class, tax, converter} = req.body;
    try {
        const [result] = await connection.execute("UPDATE klasy_grountu SET klasa = ?, podatek_za_hektar = ?, converter = ? where ID = ?", [ground_class, tax, converter, ID_ground_class]);
        res.status(200).json({success:true, message:"rekord został zaktualizowany"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/insert", [roleAuthorization(["KSIĘGOWOŚĆ"]), checkDataExisting(["ground_class", "comune", "disctrict", "province", "converter", "tax"])], async (req, res) => {
    const {ground_class, comune, disctrict, province, converter, tax} = req.body;
    let localizationID;
    try {
        const [result] = await connection.execute("SELECT ID FROM lokalizacje where comune = ?, disctrict = ?, province = ? limit 1", [comune, disctrict, province]);
        if(result.length > 0) {
            localizationID = result[0].ID;
        } else {
            const [result] = await connection.execute("INSERT INTO lokalizacje() VALUES(NULL, ?, ?, ?)", [province, disctrict, comune]);
            localizationID = result.insertId;
        }
        await connection.execute("INSERT INTO klasy_gruntu() VALUES(NULL, ?, ?, ?, ?)", [ground_class, localizationID, converter, tax]);
        res.status(200).json({success:true, message:"wstawiono nowy rekord"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;