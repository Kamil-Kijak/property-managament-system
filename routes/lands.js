
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

//router.use(authorization());

router.post("/get_owner_lands", [checkDataExisting(["ID_owner"])], (req, res) => {
    const {ID_owner} = req.body;
    connection.query("SELECT d.numer_seryjny_dzialki, d.nr_dzialki, d.powierzchnia, m.nazwa, l.gmina, l.powiat, p.typ FROM dzialki d INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji INNER JOIN przeznaczenia_dzialek p on p.ID=d.ID_przeznaczenia INNER JOIN wlasciciele w on w.ID=d.ID_wlasciciela WHERE w.ID = ?",
        [ID_owner], (err, result) => {
            if(err) {
                return res.status(500).json({
                    error:"bład bazy danych",
                    errorInfo:err
                })
            }
            res.status(200).json({success:true, message:`pobrano dzialki wlasciciela o ID ${ID_owner}`, data:dataSanitizer(result)})
        } 
    )
});

router.get("/get", [checkDataExisting(["serial_filter", "purpose_filter", "rent_filter", "comune_filter", "district_filter", "province_filter", "low_area_filter", "high_area_filter"])], (req, res) => {
    const {serial_filter, purpose_filter, rent_filter, low_area_filter, high_area_filter, comune_filter, district_filter, province_filter} = req.body;
    let SQL = "SELECT d.numer_seryjny_dzialki, d.nr_dzialki, d.powierzchnia, d.nr_kw, d.hipoteka, d.opis, d.spolka_wodna, d.ID_dzierzawy, m.nazwa, l.wojewodztwo, l.powiat, l.gmina, w.imie as w_imie, w.nazwisko as w_nazwisko, rd.nazwa as 'rodzaj', pd.typ as 'przeznaczenie', mp.kod as 'mpzp', po.kod as 'plan_ogolny', n.data_nabycia, n.nr_aktu, n.sprzedawca, n.cena_zakupu FROM dzialki d INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji INNER JOIN wlasciciele w ON w.ID=d.ID_wlasciciela INNER JOIN rodzaje_dzialek rd on rd.ID=d.ID_rodzaju INNER JOIN przeznaczenia_dzialek pd on pd.ID=d.ID_przeznaczenia INNER JOIN mpzp mp on mp.ID=d.ID_mpzp INNER JOIN plany_ogolne po on po.ID=d.ID_planu_ogolnego INNER JOIN nabycia n on n.ID=d.ID_nabycia WHERE d.numer_seryjny_dzialki LIKE ? AND pd.typ LIKE ? AND l.gmina = ? AND l.powiat = ? AND l.wojewodztwo = ?"
    const paramns = [`%${serial_filter}`, `%${purpose_filter}`, `%${comune_filter}`, `%${district_filter}`, `%${province_filter}`];
    if(low_area_filter != "" && high_area_filter != "") {
        paramns.push(low_area_filter, high_area_filter);
        SQL+= " AND d.powierzchnia BETWEEN ? AND ?"
    }
    if(rent_filter != "") {
        if(rent_filter == "1") {
            SQL += " AND d.ID_dzierzawy IS NOT NULL"
        } else {
            SQL += " AND d.ID_dzierzawy IS NULL"
        }
    }
    SQL += " LIMIT 200"
    connection.query(SQL, paramns, (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({success:true, message:"Przefiltrowano rekordy dzialek", data:dataSanitizer(result)});
    })
});
router.post("/insert", [checkDataExisting(["land_serial_number", "land_number", "area", "town", "comune", "district", "province", "ID_owner", "kw_number", "mortgage", "ID_type", "description", "ID_purpose", "ID_mpzp", "ID_general_plan", "water_company", "purchase_date", "case_number", "seller", "price"])], (req, res) => {
    const {land_serial_number, land_number, area, town, comune, district, province, ID_owner, kw_number, mortgage, ID_type, description, ID_purpose, ID_mpzp, ID_general_plan, water_company, purchase_date, case_number, seller, price} = req.body;
    let IDTown;
    connection.query("SELECT m.ID FROM miejscowosci m WHERE m.nazwa = ? LIMIT 1", 
        [town], (err, result) => {
            if(err) {
                return res.status(500).json({
                    error:"bład bazy danych",
                    errorInfo:err
                })
            }
            if(result.length > 0) {
                IDTown = result[0].ID;
            } else {
                let IDLocalization;
                connection.query("SELECT l.ID FROM lokalizacje l WHERE l.gmina = ? AND l.powiat = ? AND l.wojewodztwo = ? LIMIT 1",
                     [comune, district, province], (err, result) => {
                        if(err) {
                            return res.status(500).json({
                                error:"bład bazy danych",
                                errorInfo:err
                            })
                        }
                        if(result.length > 0) {
                            IDLocalization = result[0].ID;
                        } else {
                            connection.query("INSERT INTO lokalizacje() VALUES(NULL, ?, ?, ?)", [province, district, comune], (err, result) => {
                                 if(err) {
                                    return res.status(500).json({
                                        error:"bład bazy danych",
                                        errorInfo:err
                                    })
                                }
                                IDLocalization = result.insertId;
                            })
                        }
                        connection.query("INSERT INTO miejscowosci() VALUES(NULL, ?, ?)", [IDLocalization, town], (err, result) => {
                            if(err) {
                                return res.status(500).json({
                                    error:"bład bazy danych",
                                    errorInfo:err
                                })
                            }
                            IDTown = result.insertId
                        })
                     })
            }
        }
    )
    let IDPurchase;
    connection.query("INSERT INTO nabycia() VALUES(NULL, ?, ?, ?, ?)", [purchase_date, case_number, seller, price], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        IDPurchase = result.insertId;
    });
    // main insert
    connection.query("INSERT INTO dzialki() VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)",
         [land_serial_number, land_number, area, IDTown, ID_owner, kw_number, mortgage, ID_type, description, ID_purpose, ID_mpzp, ID_general_plan, water_company, IDPurchase], (err, result) => {
            if(err) {
                return res.status(500).json({
                    error:"bład bazy danych",
                    errorInfo:err
                })
            }
            res.status(200).json({success:true, message:"wstawiono rekord poprawnie"})
         })

})

module.exports = router;