// js
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const data = require("./data");

app.use(cors("*"));

// app.use("/assets", express.static(path.join(__dirname, "assets")));

const sayData = (req, res) => {
  res.json(data);
};

app.get("/", sayData);

app.get("/residences/:id", (req, res) => {
  const residencesId = req.params.id;
  const residence = data.find((elemn) => elemn.Id === residencesId);
  console.info(residence);

  res.json(residence);
});

const port = 3310;

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
