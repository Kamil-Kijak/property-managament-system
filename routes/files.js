
const express = require("express");
const path = require("path");
const fs = require("fs");
const authorization = require("../middlewares/authorization");
const checkDataExisting = require("../middlewares/checkDataExisting")
const multer = require("multer");



const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        if(!fs.existsSync(`./land_files/${req.params.ID}`)) {
            fs.mkdirSync(`./land_files/${req.params.ID}`, {recursive:true});
        }
        cb(null, `./land_files/${req.params.ID}`)
    },
    filename:(req, file, cb) => {
        cb(null, path.parse(file.originalname).name + path.extname(file.originalname))
    }
})
const upload = multer({
    storage:storage,
    limits: { fileSize: 10 * 1024 * 1024 }
})

const router = express.Router();

router.use(authorization());

router.get("/file/:ID/:filename", (req, res) => {
    const {ID, filename} = req.params;
    const folder = path.join(__dirname, `../land_files`, ID);
    fs.readdir(folder, (err, files) => {
        if(err) {
            return res.status(500).send(`<h1 style="text-align:center">Bład przy czytaniu plików</h1>`)
        }
        const file = files.find(file => path.parse(file).base === filename);
        if(file) {
            res.status(200).sendFile(path.join(folder, file));
        } else {
            return res.status(404).send(`<h1 style="text-align:center">Pliku nie znaleziono</h1>`)
        }
    });
});

router.post("/upload/:ID", upload.array("files"), (req, res) => {
    if(req.files) {
        res.status(200).json({success:true, message:"Pliki zostały poprawnie wgrane", files:req.files})
    } else {
        res.status(400).json({success:false, message:"Pliki zostały odrzucony"})
    }
})
router.post("/delete", [checkDataExisting(["ID", "filename"])], async (req, res) => {
    const {ID, filename} = req.body;
    try {
        fs.unlinkSync(path.join("./land_files", String(ID), filename));
        return res.status(200).json({success:true, message:"pomyślnie usunięto plik"})
    } catch (err) {
        res.status(400).json({success:false, message:"Bład podczas usuwania pliku", error:err})
    }
})



module.exports = router;