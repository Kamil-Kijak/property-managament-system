
const express = require("express");
const path = require("path");
const fs = require("fs");
const authorization = require("../middlewares/authorization");
const multer = require("multer");


const folder = path.join(__dirname, '../land_files');

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}



const storage = multer.diskStorage({
    destination:(req, file, cb) => cb(null, "./land_files"),
    filename:(req, file, cb) => {
        cb(null, req.params.serial + path.extname(file.originalname))
    }
})
const upload = multer({
    storage:storage,
    limits: { fileSize: 10 * 1024 * 1024 }
})

const router = express.Router();

router.use(authorization());

router.get("/file/:serial", (req, res) => {
    const {serial} = req.params;
    const folder = path.join(__dirname, "../land_files");
    fs.readdir(folder, (err, files) => {
        if(err) {
            return res.status(500).send(`<h1 style="text-align:center">Bład przy czytaniu plików</h1>`)
        }
        const file = files.find(file => path.parse(file).name === serial);
        if(file) {
            res.status(200).sendFile(path.join(folder, file));
        } else {
            return res.status(404).send(`<h1 style="text-align:center">Pliku nie znaleziono</h1>`)
        }
    });
});

router.post("/upload/:serial", [upload.single("file")], (req, res) => {
    if(req.file) {
        fs.readdir("./land_files", (err, files) => {
            if(err) {
                console.error("Błąd odczytu folderu:", err);
                return;
            }
            files.forEach(file => {
                const fileName = path.parse(file).name;
                if (fileName === path.parse(req.file.filename).name && file != req.file.filename) {
                    const fullPath = path.join("./land_files", file);
                    fs.unlink(fullPath, err => {
                        if (err) {
                            console.error(`Nie udało się usunąć ${file}:`, err);
                        } else {
                            console.log(`Usunięto: ${file}`);
                        }
                    });
                }
            });
            });
        res.status(200).json({success:true, message:"Plik został poprawnie wgrany", file:req.file.filename})
    } else {
        res.status(400).json({success:false, message:"Plik został odrzucony"})
    }
})



module.exports = router;