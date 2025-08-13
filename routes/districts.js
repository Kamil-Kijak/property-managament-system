

const express = require("express")

const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")


const router = express.Router();

router.use(authorization());
router.use(roleAuthorization(["KSIEGOWOSC"]))

router.get("/get", [checkDataExisting(["tax_district", "agricultural_tax", "forest_tax", "commune", "district", "province"])], async (req, res) => {
    const {tax_district, agricultural_tax, forest_tax, commune, district, province} = req.query
    try {
        let SQL = "SELECT * FROM lokalizacje WHERE wojewodztwo LIKE ? AND powiat LIKE ? AND gmina LIKE ?";
        const params = [`${province}%`, `${district}%`, `${commune}%`]
        if(tax_district != "") {
            SQL+= " AND okreg_podatkowy = ?"
            params.push(tax_district);
        }
        if(agricultural_tax != "") {
            if(agricultural_tax == "1") {
                SQL+= " AND podatek_rolny IS NOT NULL"
            } else {
                SQL+= " AND podatek_rolny IS NULL"
            }
        }
        if(forest_tax != "") {
            if(forest_tax == "1") {
                SQL+= " AND podatek_lesny IS NOT NULL"
            } else {
                SQL+= " AND podatek_lesny IS NULL"
            }
        }
        const [result] = await connection.execute(SQL, params);
        res.status(200).json({success:true, message:"przefiltrowano gminy", data:result})
    } catch (err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/update", [checkDataExisting(["ID_localization", "tax_district", "agricultural_tax", "forest_tax"])], async (req, res) => {
    const {ID_localization, tax_district, agricultural_tax, forest_tax} = req.body;
    try {
        await connection.execute("UPDATE lokalizacje SET okreg_podatkowy = ?, podatek_rolny = ?, podatek_lesny = ? WHERE ID = ?", [tax_district, agricultural_tax, forest_tax, ID_localization]);
        res.status(200).json({success:true, message:"zaktualizowano rekord"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})


module.exports = router;