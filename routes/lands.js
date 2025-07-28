
const express = require("express");
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const router = express.Router();

router.use(authorization());


router.post("/get_renter_lands", [checkDataExisting(["ID_renter"])], async (req, res) => {
    const {ID_renter} = req.body;
    try {
        const [result] = await connection.execute("SELECT d.numer_seryjny_dzialki, d.nr_dzialki, d.powierzchnia, m.nazwa as miejscowosc, l.gmina, l.powiat, l.wojewodztwo, di.wysokosc_czynszu FROM dzialki d INNER JOIN dzierzawy di on d.ID_dzierzawy=di.ID INNER JOIN dzierzawcy dz on dz.ID=di.ID_dzierzawcy INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji WHERE dz.ID = ?", [ID_renter]);
        res.status(200).json({success:true, message:`pobrano dzialki dzierzawcy o ID ${ID_renter}`, data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.get("/get_land", [checkDataExisting(["ID_land"])], async (req, res) => {
    const {ID_land} = req.query;
    try {
        const [result] = await connection.execute("SELECT d.ID, d.numer_seryjny_dzialki, d.nr_dzialki, d.powierzchnia, d.nr_kw, d.hipoteka, d.opis, d.spolka_wodna, m.nazwa as miejscowosc, l.wojewodztwo, l.powiat, l.gmina, w.ID as w_ID, rd.ID as 'rodzaj', pd.ID as 'przeznaczenie', mp.ID as 'mpzp', po.ID as 'plan_ogolny', n.data_nabycia, n.nr_aktu, n.sprzedawca, n.cena_zakupu FROM dzialki d INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji INNER JOIN wlasciciele w ON w.ID=d.ID_wlasciciela INNER JOIN rodzaje_dzialek rd on rd.ID=d.ID_rodzaju INNER JOIN przeznaczenia_dzialek pd on pd.ID=d.ID_przeznaczenia INNER JOIN mpzp mp on mp.ID=d.ID_mpzp INNER JOIN plany_ogolne po on po.ID=d.ID_planu_ogolnego INNER JOIN nabycia n on n.ID=d.ID_nabycia WHERE d.ID = ?", [ID_land]);
        res.status(200).json({success:true, message:`pobrano działkę o ID ${ID_land}`, data:result[0]})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.get("/get_rent_lands", [checkDataExisting(["przeznaczenie"])], async (req, res) => {
    const {przeznaczenie} = req.body;
    try {
        const [result] = await connection.execute("SELECT d.numer_seryjny_dzialki, d.nr_dzialki, d.powierzchnia, m.nazwa as miejscowosc, l.gmina, l.powiat FROM dzialki d INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji INNER JOIN przeznaczenia_dzialek p on p.ID=d.ID_przeznaczenia WHERE d.ID_dzierzawy IS NULL AND p.typ = ?", [przeznaczenie]);
        res.status(200).json({success:true, message:"pobrano działki przeznaczone do dzierżawy", data:result});
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.get("/get_insertion_required_data", async (req, res) => {
    try {
        const [resultOwners] = await connection.execute("SELECT * FROM wlasciciele order by nazwisko");
        const [resultLandTypes] = await connection.execute("SELECT * FROM rodzaje_dzialek");
        const [resultLandPurposes] = await connection.execute("SELECT * FROM przeznaczenia_dzialek");
        const [resultGeneralPlans] = await connection.execute("SELECT * FROM plany_ogolne order by kod");
        const [resultMpzp] = await connection.execute("SELECT * FROM mpzp order by kod");
        res.status(200).json({success:true, message:"Pobrano dane do dodania nowej działki", data:{
            owners:resultOwners,
            land_types:resultLandTypes,
            land_purposes:resultLandPurposes,
            general_plans:resultGeneralPlans,
            mpzp:resultMpzp
        }})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.get("/get", [checkDataExisting(["serial_filter", "land_number_filter", "purpose_filter", "rent_filter", "commune_filter", "district_filter", "province_filter", "town_filter", "low_area_filter", "high_area_filter", "seller_filter"])], async (req, res) => {
    const {serial_filter, purpose_filter, rent_filter, low_area_filter, high_area_filter, commune_filter, district_filter, province_filter, town_filter, land_number_filter, seller_filter} = req.query;
    let SQL = "SELECT d.ID, d.numer_seryjny_dzialki, d.nr_dzialki, d.powierzchnia, d.nr_kw, d.hipoteka, d.opis, d.spolka_wodna, m.nazwa as miejscowosc, l.wojewodztwo, l.powiat, l.gmina, w.imie as w_imie, w.nazwisko as w_nazwisko, rd.nazwa as 'rodzaj', pd.typ as 'przeznaczenie', mp.kod as 'mpzp', po.kod as 'plan_ogolny', n.data_nabycia, n.nr_aktu, n.sprzedawca, n.cena_zakupu, di.ID as 'ID_dzierzawy', dz.imie as 'd_imie', dz.nazwisko as 'd_nazwisko' FROM dzialki d LEFT JOIN dzierzawy di on di.ID=d.ID_dzierzawy LEFT JOIN dzierzawcy dz on dz.ID=di.ID_dzierzawcy INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji INNER JOIN wlasciciele w ON w.ID=d.ID_wlasciciela INNER JOIN rodzaje_dzialek rd on rd.ID=d.ID_rodzaju INNER JOIN przeznaczenia_dzialek pd on pd.ID=d.ID_przeznaczenia INNER JOIN mpzp mp on mp.ID=d.ID_mpzp INNER JOIN plany_ogolne po on po.ID=d.ID_planu_ogolnego INNER JOIN nabycia n on n.ID=d.ID_nabycia WHERE d.numer_seryjny_dzialki LIKE ? AND pd.typ LIKE ? AND l.gmina LIKE ? AND l.powiat LIKE ? AND l.wojewodztwo LIKE ? AND m.nazwa LIKE ? AND d.nr_dzialki LIKE ? AND n.sprzedawca LIKE ?"
    const paramns = [`${serial_filter}%`, `${purpose_filter}%`, `${commune_filter}%`, `${district_filter}%`, `${province_filter}%`, `${town_filter}%`, `${land_number_filter}%`, `${seller_filter}%`];
    if(low_area_filter != "" && high_area_filter != "") {
        paramns.push(low_area_filter, high_area_filter);
        SQL+= " AND d.powierzchnia BETWEEN ? AND ?"
    } else if(low_area_filter != "") {
        paramns.push(low_area_filter);
        SQL+= " AND d.powierzchnia >= ?"
    } else if(high_area_filter != "") {
        paramns.push(high_area_filter);
        SQL+= " AND d.powierzchnia <= ?"
    }
    if(rent_filter != "") {
        if(rent_filter == "1") {
            SQL += " AND d.ID_dzierzawy IS NOT NULL"
        } else {
            SQL += " AND d.ID_dzierzawy IS NULL"
        }
    }
    // SQL += " LIMIT 200"
    try {
        const [result] = await connection.execute(SQL, paramns);
        res.status(200).json({success:true, message:"Przefiltrowano rekordy dzialek", data:result});
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/delete", [roleAuthorization(["ADMIN"], checkDataExisting(["ID_land"]))], async (req, res) => {
    const {ID_land} = req.body;
    try {
        const [result] = await connection.execute("SELECT ID_nabycia FROM dzialki WHERE ID = ?", [ID_land]);
        await connection.execute("DELETE FROM dzialki WHERE ID = ?", [ID_land]);
        await connection.execute("DELETE FROM nabycia WHERE ID = ?", [result[0].ID_nabycia]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/insert", [checkDataExisting(["land_serial_number", "land_number", "area", "town", "commune", "district", "province", "ID_owner", "kw_number", "mortgage", "ID_type", "description", "ID_purpose", "ID_mpzp", "ID_general_plan", "water_company", "purchase_date", "case_number", "seller", "price"])], async (req, res) => {
    const {land_serial_number, land_number, area, town, commune, district, province, ID_owner, kw_number, mortgage, ID_type, description, ID_purpose, ID_mpzp, ID_general_plan, water_company, purchase_date, case_number, seller, price} = req.body;
    let IDTown;
    try {
        const [result] = await connection.execute("SELECT m.ID FROM miejscowosci m WHERE m.nazwa = ? LIMIT 1", [town]);
        if(result.length > 0) {
            IDTown = result[0].ID;
        } else {
            let IDLocalization;
            const [result] = await connection.execute("SELECT l.ID FROM lokalizacje l WHERE l.gmina = ? AND l.powiat = ? AND l.wojewodztwo = ? LIMIT 1", [commune, district, province]);
            if(result.length > 0) {
                IDLocalization = result[0].ID;
            } else {
                const [result] = await connection.execute("INSERT INTO lokalizacje() VALUES(NULL, ?, ?, ?)", [province, district, commune]);
                IDLocalization = result.insertId;
            }
            const [result2] = await connection.execute("INSERT INTO miejscowosci() VALUES(NULL, ?, ?)", [IDLocalization, town]);
            IDTown = result2.insertId
        }
        let IDPurchase;
        const [result2] = await connection.execute("INSERT INTO nabycia() VALUES(NULL, ?, ?, ?, ?)", [purchase_date, case_number, seller, price])
        IDPurchase = result2.insertId;

        await connection.execute("INSERT INTO dzialki() VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)", [land_serial_number, land_number, area, IDTown, ID_owner, kw_number, mortgage, ID_type, description, ID_purpose, ID_mpzp, ID_general_plan, water_company, IDPurchase]);
        res.status(200).json({success:true, message:"wstawiono rekord poprawnie"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/update", [checkDataExisting(["ID_land", "land_serial_number", "land_number", "area", "town", "commune", "district", "province", "ID_owner", "kw_number", "mortgage", "ID_type", "description", "ID_purpose", "ID_mpzp", "ID_general_plan", "water_company", "purchase_date", "case_number", "seller", "price"])], async (req, res) => {
    const {ID_land, land_serial_number, land_number, area, town, commune, district, province, ID_owner, kw_number, mortgage, ID_type, description, ID_purpose, ID_mpzp, ID_general_plan, water_company, purchase_date, case_number, seller, price} = req.body;
    let IDTown;
    try {
        const [result] = await connection.execute("SELECT m.ID FROM miejscowosci m WHERE m.nazwa = ? LIMIT 1", [town]);
        if(result.length > 0) {
            IDTown = result[0].ID;
        } else {
            let IDLocalization;
            const [result] = await connection.execute("SELECT l.ID FROM lokalizacje l WHERE l.gmina = ? AND l.powiat = ? AND l.wojewodztwo = ? LIMIT 1", [commune, district, province]);
            if(result.length > 0) {
                IDLocalization = result[0].ID;
            } else {
                const [result] = await connection.execute("INSERT INTO lokalizacje() VALUES(NULL, ?, ?, ?)", [province, district, commune]);
                IDLocalization = result.insertId;
            }
            const [result2] = await connection.execute("INSERT INTO miejscowosci() VALUES(NULL, ?, ?)", [IDLocalization, town]);
            IDTown = result2.insertId
        }
        const [result2] = await connection.execute("SELECT ID_nabycia FROM dzialki WHERE ID = ?", [ID_land]);
        await connection.execute("UPDATE nabycia SET data_nabycia = ?, nr_aktu = ?, sprzedawca = ?, cena_zakupu = ? WHERE ID = ?", [purchase_date, case_number, seller, price, result2[0].ID_nabycia]);
        const updateParams = [land_serial_number, land_number, area, IDTown, ID_owner, kw_number, mortgage, ID_type, description, ID_purpose, ID_mpzp, ID_general_plan, water_company, ID_land]
        await connection.execute("UPDATE dzialki SET numer_seryjny_dzialki = ?, nr_dzialki = ?, powierzchnia = ?, ID_miejscowosci = ?, ID_wlasciciela = ?, nr_kw = ?, hipoteka = ?, ID_rodzaju = ?, opis = ?, ID_przeznaczenia = ?, ID_mpzp = ?, ID_planu_ogolnego = ?, spolka_wodna = ? WHERE ID = ?", updateParams)
        res.status(200).json({success:true, message:"zaktualizowano poprawnie"})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err});
    }
})


module.exports = router;