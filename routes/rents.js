
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());


router.get("/get", [checkDataExisting(["name_filter", "surname_filter", "owner_name_filter", "owner_surname_filter" , "month_filter", "end_year_filter", "limit"])], async (req, res) => {
    const {month_filter, name_filter, surname_filter, end_year_filter, owner_name_filter, owner_surname_filter, limit} = req.query;
    let SQL = "SELECT di.*, d.numer_seryjny_dzialki,d.powierzchnia, dz.imie as d_imie, dz.nazwisko as d_nazwisko, dz.telefon as d_telefon, w.imie as w_imie, w.nazwisko as w_nazwisko, w.telefon as w_telefon, m.nazwa as miejscowosc, l.gmina, l.powiat, l.wojewodztwo FROM dzierzawy di INNER JOIN dzierzawcy dz on di.ID_dzierzawcy=dz.ID INNER JOIN dzialki d on d.ID_dzierzawy=di.ID INNER JOIN wlasciciele w on w.ID=d.ID_wlasciciela INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji WHERE dz.imie LIKE ? AND dz.nazwisko LIKE ? AND w.imie LIKE ? AND w.nazwisko LIKE ?";
    const paramns = [`%${name_filter}%`, `%${surname_filter}%`, `%${owner_name_filter}%`, `%${owner_surname_filter}%`];
    if(month_filter != "") {
        SQL += " AND MONTH(di.data_wystawienia_fv_czynszowej) = ?"
        paramns.push(month_filter);
    }
    if(end_year_filter != "") {
        SQL += " AND YEAR(di.data_zakonczenia) <= ?"
        paramns.push(end_year_filter);
    }
    SQL += " ORDER BY dz.nazwisko"
    if(limit != "") {
        SQL += " limit ?"
        paramns.push(limit);
    }
    try {
        await connection.execute("DELETE FROM dzierzawy WHERE data_zakonczenia < CURDATE()")
        const [result] = await connection.execute(SQL, paramns);
        res.status(200).json({success:true, message:"przefiltrowano dzierżawy", data:result})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/insert", [checkDataExisting(["ID_renter", "start_date", "end_date", "rent", "invoice_issue_date", "ID_land"])], async (req, res) => {
    const {ID_renter, start_date, end_date, rent, invoice_issue_date, ID_land} = req.body;
    try {
        const [result] = await connection.execute("INSERT INTO dzierzawy VALUES(NULL, ?, ?, ?, ?, ?)", [ID_renter, start_date, end_date, rent, invoice_issue_date]);
        await connection.execute("UPDATE dzialki SET ID_dzierzawy = ? WHERE ID = ?", [result.insertId, ID_land]);
        res.status(200).json({success:true, message:"wstawiono rekord"});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});
router.post("/update", [checkDataExisting(["ID_rent", "ID_renter", "start_date", "end_date", "rent", "invoice_issue_date"])], async (req, res) => {
    const {ID_rent, ID_renter, start_date, end_date, rent, invoice_issue_date} = req.body;
    try {
        await connection.execute("UPDATE dzierzawy SET ID_dzierzawcy = ?, data_rozpoczecia = ?, data_zakonczenia = ?, wysokosc_czynszu = ?, data_wystawienia_fv_czynszowej = ? WHERE ID = ?",
             [ID_renter, start_date, end_date, rent, invoice_issue_date, ID_rent]);
        res.status(200).json({success:true, message:"zaktualizowano rekord"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/delete", [roleAuthorization(["ADMIN"], checkDataExisting("ID_rent"))], async (req, res) => {
    const {ID_rent} = req.body;
    try {
        await connection.execute("DELETE FROM dzierzawy WHERE ID = ?", [ID_rent]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})


module.exports = router;