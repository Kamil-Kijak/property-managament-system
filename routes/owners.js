
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get", [checkDataExisting(["data_filter", "limit"])], async (req, res) => {
    const {data_filter, limit} = req.query;
    try {
        const params = [`%${data_filter}%`];
        let SQL = "SELECT w.*, d.numer_seryjny_dzialki, d.nr_dzialki, d.powierzchnia, m.nazwa as miejscowosc, l.gmina, l.powiat, l.wojewodztwo, p.typ FROM wlasciciele w INNER JOIN dzialki d on d.ID_wlasciciela=w.ID INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji LEFT JOIN przeznaczenia_dzialek p on p.ID=d.ID_przeznaczenia WHERE w.dane_osobowe LIKE ? ORDER BY w.dane_osobowe";
        if(limit) {
            SQL += " limit ?"
            params.push(limit);
        }
        const [result] = await connection.execute(SQL, params);
        res.status(200).json({success:true, message:"pobrano włascicieli i ich dzialki",data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/update", [checkDataExisting(["ID_owner", "personal_data", "phone"])], async (req, res) => {
    const {ID_owner, personal_data, phone} = req.body;
    try {
        const newPhone = phone || null
        await connection.execute("UPDATE wlasciciele SET dane_osobowe = ?, telefon = ? WHERE ID = ?", [personal_data, newPhone, ID_owner]);
        res.status(200).json({success:true, message:"rekord zaktualizowany"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/insert", [checkDataExisting(["personal_data", "phone"])], async (req, res) => {
    const {personal_data, phone} = req.body;
    try {
        const newPhone = phone || null;
        const [result] = await connection.execute("INSERT INTO wlasciciele() VALUES(NULL, ?, ?)", [personal_data, newPhone]);
        res.status(200).json({success:true, message:"dodano pomyślnie", insertID:result.insertId})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/delete", [roleAuthorization(["ADMIN"]), checkDataExisting(["ID_owner"])], async (req, res) => {
    const {ID_owner} = req.body;
    try {
        await connection.execute("DELETE FROM wlasciciele WHERE ID = ?", [ID_owner]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;