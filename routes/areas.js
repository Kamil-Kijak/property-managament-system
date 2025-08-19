
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());
router.use(roleAuthorization(["KSIEGOWOSC"]));

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