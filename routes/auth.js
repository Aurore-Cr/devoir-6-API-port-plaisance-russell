const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET / — Page d'accueil avec formulaire de connexion
router.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("login", { error: null });
});

// POST /login — Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { error: "Email ou mot de passe incorrect" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("login", { error: "Email ou mot de passe incorrect" });
    }
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", { error: "Erreur serveur, veuillez réessayer" });
  }
});

// GET /logout — Déconnexion
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// GET /docs — Documentation API (accessible sans connexion)
router.get("/docs", (req, res) => {
  res.render("docs");
});

module.exports = router;
