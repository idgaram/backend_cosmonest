// js
const express = require("express");
const cors = require("cors");
const app = express();

const data = [
  {
    id: 1,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
  {
    id: 2,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
  {
    id: 3,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
  {
    id: 4,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
  {
    id: 5,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
  {
    id: 6,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
  {
    id: 7,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
  {
    id: 8,
    imgSrc: "https://place-hold.it/300x200",
    name: "Maison de Jessy",
    describe: "Cet Maison est au bord de la montagne...",
  },
];

app.use(cors());

const sayData = (req, res) => {
  res.json(data);
};

app.get("/", sayData);

const port = 3310;

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
