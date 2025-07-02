
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const connection = require("../util/mysqlConnection")

const authorization = require("../middlewares/authorization");
const roleAuthorization = require("../middlewares/roleAuthorization")
const checkDataExisting = require("../middlewares/checkDataExisting");


const dataSanitizer = require("../util/dataSanitizer")

const router = express.Router();

router.get("/get", (req, res) => {
    connection.query("SELECT ID, imie, nazwisko, rola from uzytkownicy", (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({
            success:true,
            message:"pobrano użytkowników",
            data:dataSanitizer(result)
        })
    })
});

router.post("/login", [checkDataExisting(["ID_user", "password"]), (req, res) => {
    const {ID_user, password} = req.body;
    connection.query("SELECT COUNT(ID) as count from uzytkownicy where ID = ?", [ID_user], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        if(result[0].count == 0) {
            res.status(400).json({
                error:"Nie ma takiego użytkownika"
            })
        } else {
            connection.query("SELECT ID, imie, nazwisko, rola from uzytkownicy where ID = ? and password = ?",
                 [ID_user, crypto.createHash("md5").update(password).digest("hex")], (err, result) => {
                    if(err) {
                        return res.status(500).json({
                            error:"bład bazy danych",
                            errorInfo:err
                        })
                    }
                    if(result.length == 0) {
                         res.status(400).json({
                            error:"błędne hasło"
                        })
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
                        res.status(200).json({success:true, message:"zalogowano pomyślnie"})
                    }
                 })
        }
    })
}])

router.post("/update", [authorization(), roleAuthorization(["ADMIN"]), checkDataExisting(["ID_user", "name", "surname", "password", "role"])], (req, res) => {
    const {ID_user, name, surname, password, role} = req.body
    connection.query("UPDATE uzytkownicy SET imie = ?, nazwisko = ?, haslo = ?, rola = ? WHERE ID = ?",
         [name, surname, crypto.createHash("md5").update(password).digest("hex"), role, ID_user], (req, res) => {
            if(err) {
                return res.status(500).json({
                    error:"bład bazy danych",
                    errorInfo:err
                })
            }
            res.status(200).json({success:true, message:"uzytkownik zaktualizowany"})
         })
})

router.post("/insert", [authorization(), roleAuthorization(["ADMIN"]), checkDataExisting(["name", "surname", "password", "role"])], (req, res) => {
    const {name, surname, password, role} = req.body
    connection.query("INSERT INTO() VALUES(NULL, ?, ?, ?, ?)",[name, surname, crypto.createHash("md5").update(password).digest("hex"), role], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({
            success:true,
            message:"dodano pomyslnie"
        })
    })
})
router.post("/delete", [authorization(), roleAuthorization(["ADMIN"]), checkDataExisting(["ID_user"])], (req, res) => {
    const {ID_user} = req.body;
    connection.query("DELETE FROM uzytkownicy where ID = ?", [ID_user], (err, result) => {
        if(err) {
            return res.status(500).json({
                error:"bład bazy danych",
                errorInfo:err
            })
        }
        res.status(200).json({
            success:true,
            message:"usunieto pomyslnie"
        })
    })
})

router.get("/logout", (req, res) => {
    res.clearCookie("ACCESS_TOKEN")
    res.clearCookie("REFRESH_TOKEN")
    res.status(200).json({success:true,message:"logout successfully"})
})

module.exports = router;