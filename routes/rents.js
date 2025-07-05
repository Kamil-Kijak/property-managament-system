
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.use(authorization());

router.get("/get_renter", [checkDataExisting(["ID_rent"])], async (req, res) => {
    const {ID_rent} = req.body;
    try {
        const [result] = await connection.execute("SELECT dz.imie dz.nazwisko FROM dzierzawy d INNER JOIN dzierzawcy dz on d.ID_dzierzawcy=dz.ID WHERE d.ID = ?", [ID_rent]);
        res.status(200).json({success:true, message:"pobrano dane dzierżawcy", data:dataSanitizer(result)});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.get("/get", [checkDataExisting(["month_filter", "year_filter", "show_expired"])], async (req, res) => {
    const {month_filter, year_filter, show_expired} = req.body;
    let SQL = "SELECT d.*, dz.imie, dz.nazwisko FROM dzierzawy d INNER JOIN dzierzawcy dz on d.ID_dzierzawcy=dz.ID";
    const paramns = [];
    if(month_filter != "" && year_filter != "") {
        SQL += " WHERE MONTH(d.data_wystawienia_fv_czynszowej) = ? AND YEAR(d.data_wystawienia_fv_czynszowej) = ?"
        paramns.push(month_filter, year_filter);
    }
    if(show_expired == false) {
        SQL+=" AND d.data_zakonczenia >= CURDATE()"
    }
    SQL+= " ORDER BY d.data_zakonczenia"
    try {
        const [result] = await connection.execute(SQL, paramns);
        res.status(200).json({success:true, message:"przefiltrowano dzierżawy", data:dataSanitizer(result)})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/insert", [checkDataExisting(["ID_renter", "start_date", "end_date", "rent", "invoice_issue_date"])], async (req, res) => {
    const {ID_renter, start_date, end_date, rent, invoice_issue_date} = req.body;
    try {
        const [result] = await connection.execute("INSERT INTO dzierzawy VALUES(NULL, ?, ?, ?, ?, ?)", [ID_renter, start_date, end_date, rent, invoice_issue_date]);
        res.status(200).json({success:true, message:"wstawiono rekord"});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.post("/update", [checkDataExisting(["ID_rent", "ID_renter", "start_date", "end_date", "rent", "invoice_issue_date"])], async (req, res) => {
    const {ID_rent, ID_renter, start_date, end_date, rent, invoice_issue_date} = req.body;
    try {
        const [result] = await connection.execute("UPDATE dzierzawy SET ID_dzierzawcy = ?, data_rozpoczecia = ?, data_zakonczenia = ?, wysokosc_czynszu = ?, data_wystawienia_fv_czynszowej = ? WHERE ID = ?",
             [ID_renter, start_date, end_date, rent, invoice_issue_date, ID_rent]);
        res.status(200).json({success:true, message:"zaktualizowano rekord"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/delete", [roleAuthorization(["ADMIN"], checkDataExisting("ID_rent"))], async (req, res) => {
    const {ID_rent} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM dzierzawy WHERE ID = ?", [ID_rent]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})


module.exports =  router;