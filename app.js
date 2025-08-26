require("dotenv").config();

const fs = require("fs")
const express = require("express")
const http = require("http");
const cookieParser = require("cookie-parser")
const path = require("path");
const rateLimit = require("express-rate-limit")
const transporter = require("./util/mailTransporter")
const cron = require("node-cron")
const { exec } = require("child_process");

const connection = require("./util/mysqlConnection")

// routes variables
const userRoutes = require("./routes/users");
const landTypesRoutes = require("./routes/landTypes")
const landPurposesRoutes = require("./routes/landPurposes")
const mpzpRoutes = require("./routes/mpzp")
const mainPlansRoutes = require("./routes/generalPlans")
const groundClassesRoutes = require("./routes/groundClasses");
const ownersRoutes = require("./routes/owners")
const landsRoutes = require("./routes/lands");
const rentsRoutes = require("./routes/rents");
const rentersRoutes = require("./routes/renters");
const areasRoutes = require("./routes/areas");
const districtsRoutes = require("./routes/districts");
const filesRoutes = require("./routes/files")

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
});

// middlewares
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// static page host
if(process.env.STATIC_HOST) {
  app.use(express.static(path.join(__dirname, "app", "dist")))
}

// routes
app.use("/api/user", userRoutes);
app.use("/api/land_types", landTypesRoutes);
app.use("/api/land_purposes", landPurposesRoutes)
app.use("/api/mpzp", mpzpRoutes);
app.use("/api/general_plans", mainPlansRoutes);
app.use("/api/ground_classes", groundClassesRoutes);
app.use("/api/owners", ownersRoutes);
app.use("/api/lands", landsRoutes);
app.use("/api/rents", rentsRoutes);
app.use("/api/renters", rentersRoutes);
app.use("/api/areas", areasRoutes);
app.use("/api/districts", districtsRoutes)
app.use("/api/files", filesRoutes)

app.use((req, res) => {
  if(process.env.STATIC_HOST) {
    res.sendFile(path.join(__dirname, "app", 'dist', 'index.html'));
  } else {
    res.status(400).send(`
    <main className="flex flex-col items-center justify-center h-screen">
            <section className="base-card gap-y-5">
                <h1 className="text-black text-4xl font-bold">Ups - Strony nie znaleziono</h1>
                <h1 className="text-6xl font-bold text-green-500">404</h1>
                <section>
                    <a href="/lands" className="base-btn text-2xl">Powrót</a>
                </section>
            </section>
        </main>`
      )
  }
});


const generate = async () => {
  // description generation and email send
    try {
      const today = new Date();
      const [result] = await connection.execute("SELECT d.nr_dzialki, m.nazwa as miejscowosc, l.gmina, l.powiat, l.wojewodztwo, di.data_zakonczenia, dz.imie, dz.nazwisko, dz.telefon FROM dzierzawy di INNER JOIN dzierzawcy dz on di.ID_dzierzawcy=dz.ID INNER JOIN dzialki d on d.ID_dzierzawy=di.ID INNER JOIN miejscowosci m on m.ID=d.ID_miejscowosci INNER JOIN lokalizacje l on l.ID=m.ID_lokalizacji WHERE di.data_zakonczenia BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 6 MONTH)");
      if(result.length >= 0) {
        const mailOptions = {
          from:process.env.MAIL_USER || "something@gmail.com",
          to:process.env.MAIL_ADMIN || "something@gmail.com",
          subject:`Raport SK invest z dnia ${today.toLocaleDateString("pl-PL")}`,
          html:`
          <h1 style="text-align:center;color:black;">Raport z systemu SK INVEST</h1>
          <h2 style="text-align:center;color:black">SK INVEST</h2>
          <hr/>
          <h2 style="text-align:center;color:black">Kończące się dzierżawy</h2>
          ${result.length == 0 ? `<h3 style="text-align:center;color:black">BRAK</h3>` : `<h3 style="text-align:center;color:black">Znaleziono ${result.length} kończących się</h3>`}
          ${result.length > 0 ?
             `
              <table style="margin:auto">
            <thread>
              <tr style="background-color:lime">
                <th style="text-align:center">Nr działki</th>
                <th style="text-align:center">Miejscowość</th>
                <th style="text-align:center">Lokalizacja</th>
                <th style="text-align:center">data zakończenia</th>
                <th style="text-align:center">Dzierżawca</th>
              </tr>
            </thread>
            <tbody>
          ${
            result.map((obj) =>{
              const endDate = new Date(obj.data_zakonczenia);
            return `<tr style="background-color:#DADADB">
              <td style="text-align:center">${obj.nr_dzialki}</td>
              <td style="text-align:center">${obj.miejscowosc}</td>
              <td style="text-align:center">${obj.gmina}, ${obj.powiat}, ${obj.wojewodztwo}</td>
              <td style="text-align:center">${endDate.toLocaleDateString("pl-PL")}</td>
              <td style="text-align:center">${obj.imie} ${obj.nazwisko}, tel:${obj.telefon}</td>
            </tr>`})
          }
          </tbody>
          </table>
          ` : ""}
          <p>Wiadomość generowana automatycznie. Proszę na nią nie odpowiadać</p>
          `
        }
        transporter.sendMail(mailOptions, (error, info) => {
          if(error) {
            console.log("Bład przy wysyłaniu email", error)
          } else {
            console.log("Email wysłany ", info.response)
          }
        })
      }
    } catch(err) {
      console.log("Bład podczas generowania raportu", err)
    }
  }

// cron task
cron.schedule(process.env.CRON_SHEDULE || "0 12 * * 1", () => {
  const weekNumber = Math.floor((new Date().getTime() / (1000 * 60 * 60 * 24 * 7)));
  if(weekNumber % 4 == 0) {
    // backup
    const today = new Date()
    const backupDir = process.env.BACKUP_DIR || './backups';
    // deleting old backup
    fs.readdir(backupDir, (err, files) => {
      if(err) {
        console.error('Błąd podczas odczytu folderu:', err);
      }
      if(files.length > 2) {
        let oldestFile = null;
        let oldestTime = Date.now();
        files.forEach((file) => {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath)
          if (stats.isFile() && stats.mtimeMs < oldestTime) {
            oldestTime = stats.mtimeMs;
            oldestFile = filePath;
          }
        })
        if(oldestFile) {
          fs.unlink(oldestFile, err => {
            if(err) {
              console.error('Błąd podczas usuwania pliku', err);
            }
          })
        }
      }
    })
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
    const fileName = `${process.env.DB_NAME || "database"}-${today.toLocaleDateString("sv-SE")}`
    const filePath = path.join(backupDir, fileName);
    const dumpCommand = `mysqldump -h ${process.env.DB_HOST || "localhost"} -u ${process.env.DB_USER || "root"} -p${process.env.DB_PASSWORD || ""} ${process.env.DB_NAME || "database"} > ${filePath}.sql`;
    exec(dumpCommand, (err, stdout, stderr) => {
      if(err) {
        console.log("bład podczas tworzenie backup", err.message)
      } else {
        console.log("backup zapisany w", filePath);
      }
    })
    // report generation
    generate();
  }
})



const server = http.createServer(app);


server.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log(`Serwer działa na porcie ${process.env.PORT || 3000}`)
})

