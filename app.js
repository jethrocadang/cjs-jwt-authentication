//app.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(port, () => {
  console.log(`Project Zero Express: Listening on port ${port}`);
});
