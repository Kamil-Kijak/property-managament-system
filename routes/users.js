
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const connection = require("../util/mysqlConnection")

const authorization = require("../middlewares/authorization");
const roleAuthorization = require("../middlewares/roleAuthorization")
const checkDataExisting = require("../middlewares/checkDataExisting");


const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.get("/get", async (req, res) => {
    try {
        const [result] = await connection.execute("SELECT ID, imie, nazwisko, rola from uzytkownicy")
        res.status(200).json({success:true, message:"pobrano użytkowników", data:dataSanitizer(result)})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.get("/auth", [authorization()], (req, res) => {
    res.status(200).json({success:true, message:"Zweryfikowano poprawnie", user:req.user})
})

router.post("/register_admin", [checkDataExisting(["name", "surname", "password"])], async (req, res) => {
    const {name, surname, password} = req.body;
    try {
        const [result] = await connection.execute("SELECT COUNT(ID) as count FROM uzytkownicy WHERE rola = 'ADMIN'");
        if(result[0].count == 0) {
            await connection.execute("INSERT INTO uzytkownicy VALUES(NULL, ?, ?, ?, 'ADMIN')",[name, surname, crypto.createHash("md5").update(password).digest("hex")])
            res.status(200).json({success:true, message:"zarejestrowano pomyslnie admina"})
        } else {
            res.status(406).json({error:"ADMIN juz istnieje"})
        }
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
});

router.post("/login", [checkDataExisting(["ID_user", "password"]), async (req, res) => {
    const {ID_user, password} = req.body;
    try {
        const [result] = await connection.execute("SELECT COUNT(ID) as count from uzytkownicy where ID = ?", [ID_user])
        if(result[0].count == 0) {
            res.status(400).json({error:"Nie ma takiego użytkownika"})
        } else {
            const [result] = await connection.execute("SELECT ID, imie, nazwisko, rola from uzytkownicy where ID = ? and haslo = ?", [ID_user, crypto.createHash("md5").update(password).digest("hex")]);
            if(result.length == 0) {
                res.status(400).json({error:"błędne hasło"})
            } else {
                // create token
                const refreshToken = jwt.sign({
                    ...result[0]
                }, process.env.REFRESH_TOKEN_KEY || "inWhm0r9gfwJ_s07KEYrX", {expiresIn:"8h"})
                
                res.cookie("REFRESH_TOKEN", refreshToken, {
                    maxAge:1000 * 60 * 60 * 8,
                    httpOnly:true,
                    secure:false
                })
                res.status(200).json({success:true, message:"zalogowano pomyślnie", data:dataSanitizer(result)[0]})
            }
        }
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
    
}]);

router.get("/logout", (req, res) => {
    res.clearCookie("ACCESS_TOKEN")
    res.clearCookie("REFRESH_TOKEN")
    res.status(200).json({success:true,message:"logout successfully"})
})

router.use(authorization());
router.use(roleAuthorization(["ADMIN"]));

router.post("/update", [checkDataExisting(["ID_user", "name", "surname", "password", "role"])], async (req, res) => {
    const {ID_user, name, surname, password, role} = req.body
    try {
        const [result] = await connection.execute("UPDATE uzytkownicy SET imie = ?, nazwisko = ?, haslo = ?, rola = ? WHERE ID = ?", [name, surname, crypto.createHash("md5").update(password).digest("hex"), role, ID_user])
        res.status(200).json({success:true, message:"uzytkownik zaktualizowany"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

router.post("/insert", [checkDataExisting(["name", "surname", "password", "role"])], async (req, res) => {
    const {name, surname, password, role} = req.body
    try {
        const [result] = await connection.execute("INSERT INTO uzytkownicy VALUES(NULL, ?, ?, ?, ?)",[name, surname, crypto.createHash("md5").update(password).digest("hex"), role])
        res.status(200).json({success:true, message:"dodano pomyslnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})
router.post("/delete", [checkDataExisting(["ID_user"])], async (req, res) => {
    const {ID_user} = req.body;
    try {
        const [result] = await connection.execute("DELETE FROM uzytkownicy where ID = ?",[ID_user])
        res.status(200).json({success:true, message:"usunięto pomyślnie"})
    } catch(err) {
        return res.status(500).json({error:"bład bazy danych", errorInfo:err})
    }
})

module.exports = router;