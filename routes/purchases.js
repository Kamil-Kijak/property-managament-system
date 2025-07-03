
const express = require("express");
const router = express.Router()
const connection = require("../util/mysqlConnection")

const checkDataExisting = require("../middlewares/checkDataExisting")
const authorization = require("../middlewares/authorization")
const roleAuthorization = require("../middlewares/roleAuthorization")

const dataSanitizer = require("../util/dataSanitizer")

router.use(authorization());

router.get("/get", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT * FROM nabycia");
        res.status(200).json({success:true, message:"pobrano nabycia", data:dataSanitizer(result)})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.use(roleAuthorization(["ADMIN"]));

router.post("/update", [checkDataExisting(["ID_purchase", "purchase_date", "case_number", "seller", "price"])], async (req, res) => {
    const {ID_purchase, purchase_date, case_number, seller, price} = req.body;
    try {
        const [result] = await connection.execute("UPDATE nabycia SET data_nabycia = ?, nr_aktu = ?, sprzedawca = ?, cena_zakupu = ? where ID = ?", [purchase_date, case_number, seller, price, ID_purchase]);
        res.status(200).json({success:true, message:"rekord został zaktualizowany"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/delete", [checkDataExisting(["ID_purchase"])], async (req, res) => {
    const {ID_purchase} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM nabycia WHERE ID = ?", [ID_purchase]);
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})



module.exports = router;