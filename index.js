// js
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const data = require("./data");
const port = 3310;

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

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "your_jwt_secret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

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

app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
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

  const username = user.username;

  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  res.status(200).json({ token, username });
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

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
