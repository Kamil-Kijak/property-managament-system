require("dotenv").config();

const express = require("express")
const http = require("http");
const cookieParser = require("cookie-parser")


// routes variables
const userRoutes = require("./routes/users");
const landTypesRoutes = require("./routes/landTypes")
const landPurposesRoutes = require("./routes/landPurposes")
const mpzpRoutes = require("./routes/mpzp")
const mainPlansRoutes = require("./routes/generalPlans")
const purchasesRoutes = require("./routes/purchases")
const groundClassesRoutes = require("./routes/groundClasses");
const ownersRoutes = require("./routes/owners")

const app = express();
// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/user", userRoutes);
app.use("/api/land_types", landTypesRoutes);
app.use("/api/land_purposes", landPurposesRoutes)
app.use("/api/mpzp", mpzpRoutes);
app.use("/api/general_plans", mainPlansRoutes);
app.use("/api/purchaces", purchasesRoutes);
app.use("/api/ground_classes", groundClassesRoutes);
app.use("/api/owners", ownersRoutes);

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log(`serwer nasłuchuje na porcie ${process.env.PORT || 3000}`)
})