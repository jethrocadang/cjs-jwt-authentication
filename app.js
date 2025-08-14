//app.js

require("dotenv").config({debug: true});

//Packages
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Config
const connectDB = require("./config/database");

// Routes import
const authRoutes = require("./routes/auth-routes");

connectDB();
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Root route is working");
});

//Routes
app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`Project Zero Express: Listening on port ${port}`);
});
