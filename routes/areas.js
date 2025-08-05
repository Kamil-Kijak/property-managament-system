
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get", [checkDataExisting(["ID_land"])], async (req, res) => {
    const {ID_land} = req.query;
    try {
        const [result] = await connection.execute("SELECT pd.ID, pd.powierzchnia, pd.zwolniona_powierzchnia, k.ID as ID_ground_class, k.klasa, k.przelicznik, k.podatek, l.podatek_lesny, l.podatek_rolny FROM powierzchnie_dzialek pd INNER JOIN klasy_gruntu k ON pd.ID_klasy=k.ID INNER JOIN lokalizacje l on k.okreg_podatkowy=l.okreg_podatkowy WHERE pd.ID_dzialki = ?", [ID_land]);
        res.status(200).json({success:true, message:`pobrano powierzchnie dzialki ${ID_land}`, data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/insert", [checkDataExisting(["ID_land", "ID_ground_class", "area", "released_area"])], async (req, res) => {
    const {ID_land, ID_ground_class, area, released_area} = req.body;
    try {
        await connection.execute("INSERT INTO powierzchnie_dzialek VALUES(NULL, ?, ?, ?, ?)", [ID_land, ID_ground_class, area, released_area]);
        res.status(200).json({success:true, message:"wstawiono nowy rekord"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/update", [checkDataExisting(["ID_area", "ID_ground_class", "area", "released_area"])], async (req, res) => {
    const {ID_area, ID_ground_class, area, released_area} = req.body;
    try {
        await connection.execute("UPDATE powierzchnie_dzialek SET ID_klasy = ?, powierzchnia = ?, zwolniona_powierzchnia = ? WHERE ID = ?", [ID_ground_class, area, released_area, ID_area]);
        res.status(200).json({success:true, message:"zaktualizowano rekord"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/delete", [checkDataExisting(["ID_area"])], async (req, res) => {
    const {ID_area} = req.body;
    try {
        await connection.execute("DELETE FROM powierzchnie_dzialek WHERE ID = ?", [ID_area]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;