

const express = require("express")

const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());

router.get("/get", [checkDataExisting(["tax_district", "have_tax", "commune", "district", "province"])], async (req, res) => {
    const {tax_district, have_tax, commune, district, province} = req.query
    try {
        let SQL = "SELECT * FROM lokalizacje WHERE wojewodztwo LIKE ? AND powiat LIKE ? AND gmina LIKE ?";
        const params = [`${province}%`, `${district}%`, `${commune}%`]
        if(tax_district != "") {
            SQL+= " AND okreg_podatkowy = ?"
            params.push(tax_district);
        }
        if(have_tax != "") {
            if(have_tax == "1") {
                SQL+= " AND podatek IS NOT NULL"
            } else {
                SQL+= " AND podatek IS NULL"
            }
        }
        const [result] = await connection.execute(SQL, params);
        res.status(200).json({success:true, message:"przefiltrowano gminy", data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/update", [checkDataExisting(["ID_localization", "tax_district", "tax"])], async (req, res) => {
    const {ID_localization, tax_district, tax} = req.body;
    try {
        await connection.execute("UPDATE lokalizacje SET okreg_podatkowy = ?, podatek = ? WHERE ID = ?", [tax_district, tax, ID_localization]);
        res.status(200).json({success:true, message:"zaktualizowano rekord"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})


module.exports = router;