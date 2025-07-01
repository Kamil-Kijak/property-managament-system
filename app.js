require("dotenv").config();

const express = require("express")
const http = require("http");
const cookieParser = require("cookie-parser")

const sanitizeData = require("./middlewares/sanitizeData")

// routes variables
const userRoutes = require("./routes/users");

const app = express();
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeData);

// routes and endpoints
app.get("/api", (req, res) => {
    res.status(200).send("<h1>Hello world</h1>")
})

app.use("/api/user", userRoutes)

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log(`serwer nasłuchuje na porcie ${process.env.PORT || 3000}`)
})