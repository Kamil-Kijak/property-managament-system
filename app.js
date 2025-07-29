require("dotenv").config();

const express = require("express")
const http = require("http");
const cookieParser = require("cookie-parser")
const path = require("path");
const rateLimit = require("express-rate-limit")
const transporter = require("./util/mailTransporter")


// routes variables
const userRoutes = require("./routes/users");
const landTypesRoutes = require("./routes/landTypes")
const landPurposesRoutes = require("./routes/landPurposes")
const mpzpRoutes = require("./routes/mpzp")
const mainPlansRoutes = require("./routes/generalPlans")
const purchasesRoutes = require("./routes/purchases")
const groundClassesRoutes = require("./routes/groundClasses");
const ownersRoutes = require("./routes/owners")
const landsRoutes = require("./routes/lands");
const rentsRoutes = require("./routes/rents");
const rentersRoutes = require("./routes/renters");
const areasRoutes = require("./routes/Areas");
const districtsRoutes = require("./routes/districts")

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
});

// middlewares
app.use(limiter);
app.use(express.json());
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
app.use("/api/purchaces", purchasesRoutes);
app.use("/api/ground_classes", groundClassesRoutes);
app.use("/api/owners", ownersRoutes);
app.use("/api/lands", landsRoutes);
app.use("/api/rents", rentsRoutes);
app.use("/api/renters", rentersRoutes);
app.use("/api/areas", areasRoutes);
app.use("/api/districts", districtsRoutes)

const server = http.createServer(app);


server.listen(process.env.PORT || 3000, () => {
    console.log(`serwer nasłuchuje na porcie ${process.env.PORT || 3000}`)
})

