require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");

const connectDB = require("./db/mongo");
const auth = require("./middleware/auth");

connectDB();

const app = express();

// Moteur de vues
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares Express Generator
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  }),
);

// Utilisateur
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes publiques
app.use("/", require("./routes/auth"));

//  Routes protégées
app.use("/catways", auth, require("./routes/catways"));
app.use("/reservations", auth, require("./routes/reservations"));
app.use("/users", auth, require("./routes/users"));

//  Dashboard
app.get("/dashboard", auth, async (req, res, next) => {
  const Reservation = require("./models/Reservation");
  const today = new Date();
  try {
    const reservations = await Reservation.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
    }).sort({ endDate: 1 });
    res.render("dashboard", { reservations, today });
  } catch (err) {
    next(err);
  }
});

// Gestion des erreurs Express Generator
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
