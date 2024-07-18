// js
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const data = require("./data");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// app.use("/assets", express.static(path.join(__dirname, "assets")));

const sayData = (req, res) => {
  res.json(data);
};

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/cosmonest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  await user.save();
  res.status(201).send("User registered successfully");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid credentials");
  }

  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
});

app.get("/", sayData);

app.get("/residences/:id", (req, res) => {
  const residencesId = parseInt(req.params.id);
  const residence = data.find((elem) => elem.Id === residencesId);
  console.info(residence);

  res.json(residence);
});

app.get("/destinationchoisie/:id", (req, res) => {
  const destinationId = parseInt(req.params.id);
  const destination = data.find((elem) => elem.Id === destinationId);
  res.json(destination);
});

const port = 3310;

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
