
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get_renter", [checkDataExisting(["ID_rent"])], async (req, res) => {
    const {ID_rent} = req.query;
    try {
        const [result] = await connection.execute("SELECT dz.imie dz.nazwisko FROM dzierzawy d INNER JOIN dzierzawcy dz on d.ID_dzierzawcy=dz.ID WHERE d.ID = ?", [ID_rent]);
        res.status(200).json({success:true, message:"pobrano dane dzierżawcy", data:result});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.get("/get_all", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT * FROM dzierzawcy order by nazwisko");
        res.status(200).json({success:true, message:"pobrano dane dzierżawców", data:result});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.get("/get", [checkDataExisting(["name_filter", "surname_filter"])], async (req, res) => {
    const {name_filter, surname_filter} = req.query;
    try {
        const [result] = await connection.execute("SELECT * FROM dzierzawcy WHERE imie LIKE ? AND surname LIKE ?", [`%${name_filter}`, `%${surname_filter}`]);
        res.status(200).json({success:true, message:"pobrano dzierżawców",data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/insert", [checkDataExisting(["name", "surname", "phone"])], async (req, res) => {
    const {name, surname, phone} = req.body;
    try {
        const [result] = await connection.execute("INSERT INTO dzierzawcy() VALUES(NULL, ?, ?, ?)", [name, surname, phone]);
        res.status(200).json({success:true, message:"utworzono nowego dzierzawce", insertID:result.insertId});
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/update", [checkDataExisting(["ID_renter", "name", "surname", "phone"])], async (req, res) => {
    const {ID_renter, name, surname, phone} = req.body;
    try {
        const [result] = await connection.execute("UPDATE dzierzawcy SET imie = ?, nazwisko = ?, telefon = ? WHERE ID = ?", [name, surname, phone, ID_renter]);
        res.status(200).json({success:true, message:"zaktualizowano rekord"});
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.post("/delete", [roleAuthorization(["ADMIN"]), checkDataExisting(["ID_renter"])], async (req, res) => {
    const {ID_renter} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM dzierzawcy WHERE ID = ?", [ID_renter]);
        res.status(200).json({success:true, message:"usunięto pomyslnie"});
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;